import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AssetsModule } from "../assets/assets.module";

@Module({
  imports: [AssetsModule],
  providers: [AnalyticsService]
})
export class AnalyticsModule {}
