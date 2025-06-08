import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AssetsModule } from './assets/assets.module';
import { LlmAgentModule } from './llm-agent/llm-agent.module';

@Module({
  imports: [AssetsModule, LlmAgentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
