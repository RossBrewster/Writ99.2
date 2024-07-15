import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';

@Injectable()
export class ClaudeService implements OnModuleInit {
  private anthropic: Anthropic;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const apiKey = this.configService.get<string>('ANTHROPIC_API_KEY');
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY is not set in the environment variables');
    }
    this.anthropic = new Anthropic({ apiKey });
  }

  async streamChatCompletion(messages: Anthropic.MessageParam[]) {
    return this.anthropic.messages.stream({
      messages: messages,
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1024,
    });
  }
}