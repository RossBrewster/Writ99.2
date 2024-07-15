// gateway/gateway.ts

// import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
// import { OnModuleInit } from "@nestjs/common";
// import { Server } from "socket.io";

// @WebSocketGateway({
//     cors: {
//       origin: [
//         'http://localhost:5173',
//         'http://localhost:3000',
//         'https://your-production-domain.com',
//       ],
//       methods: ['GET', 'POST'],
//       credentials: true,
//     },
//   })
// export class myGateway implements OnModuleInit {
//     @WebSocketServer()
//     server: Server;

//     onModuleInit(){
//         this.server.on('connection', (socket) => {
//           console.log(socket.id)
//           console.log('Socket server is running')
//         });
//     }


//     @SubscribeMessage('newMessage')
//     onNewMessage(@MessageBody() body: any){
//       console.log(body)
//       this.server.emit('onMessage', {
//         msg: 'New Message',
//         content: body
//       });
//     }
// }


import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, ConnectedSocket } from "@nestjs/websockets";
import { OnModuleInit, Inject } from "@nestjs/common";
import { Server, Socket } from "socket.io";
import { ClaudeService } from '../modules/claude/claude.service';


interface ContentBlock {
  type: string;
  text?: string;
}

interface Message {
  role: string;
  content: ContentBlock[];
}


@WebSocketGateway({
  cors: {
    origin: 'http://localhost:5173', // Your frontend URL
    methods: ['GET', 'POST'],
    credentials: true,
  },
  namespace: '/',
  port: 3001
})


export class MyGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  constructor(@Inject(ClaudeService) private claudeService: ClaudeService) {}

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(`Client connected: ${socket.id}`);
    });
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(@MessageBody() message: string, @ConnectedSocket() client: Socket) {
    console.log(`Received message: ${message}`);
    
    try {
      const stream = await this.claudeService.streamChatCompletion([{ role: 'user', content: message }]);
      
      let currentMessage: Message = { role: 'assistant', content: [] };
      let currentContentBlock: ContentBlock | null = null;

      for await (const event of stream) {
        switch (event.type) {
          case 'message_start':
            currentMessage = event.message;
            client.emit('messageStart', { role: currentMessage.role });
            break;
          
          case 'content_block_start':
            currentContentBlock = event.content_block;
            break;
          
          case 'content_block_delta':
            if (currentContentBlock && event.delta.type === 'text_delta') {
              if (currentContentBlock.type === 'text') {
                currentContentBlock.text = (currentContentBlock.text || '') + event.delta.text;
                client.emit('contentDelta', { text: event.delta.text });
              }
            }
            break;
          
          case 'content_block_stop':
            if (currentContentBlock) {
              currentMessage.content.push(currentContentBlock);
              currentContentBlock = null;
            }
            break;
          
          case 'message_delta':
            // Handle any message-level updates if needed
            break;
          
          case 'message_stop':
            client.emit('messageComplete', currentMessage);
            break;
          
          // Handle other event types as needed
        }
      }
    } catch (error) {
      console.error('Error in Claude API call:', error);
      client.emit('error', { message: 'An error occurred during the API call' });
    }
  }
}