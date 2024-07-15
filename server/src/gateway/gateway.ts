// gateway/gateway.ts

import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { OnModuleInit } from "@nestjs/common";
import { Server } from "socket.io";

@WebSocketGateway({
    cors: {
      origin: [
        'http://localhost:5173',
        'http://localhost:3000',
        'https://your-production-domain.com',
      ],
      methods: ['GET', 'POST'],
      credentials: true,
    },
  })
export class myGateway implements OnModuleInit {
    @WebSocketServer()
    server: Server;

    onModuleInit(){
        this.server.on('connection', (socket) => {
          console.log(socket.id)
          console.log('Socket server is running')
        });
    }


    @SubscribeMessage('newMessage')
    onNewMessage(@MessageBody() body: any){
      console.log(body)
      this.server.emit('onMessage', {
        msg: 'New Message',
        content: body
      });
    }
}
