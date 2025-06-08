import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AddDataChannelDto } from './dto/add-data-channel.dto';
import { AddDataPointsDto } from './dto/add-data-points.dto';
import { AssetService } from "./assets.service";

@Controller('assets')
export class AssetController {
  constructor(private readonly assetService: AssetService) {}

  @Post(':id/channels')
  addDataChannel(@Body() addDto: AddDataChannelDto) {
    return this.assetService.addDataChannel(addDto);
  }

  @Post(':id/points')
  addDataPoints(@Body() addDto: AddDataPointsDto) {
    return this.assetService.addDataPoints(addDto);
  }

  @Get(':id/channels/:channelName/points')
  getDataPoints(
    @Param('id') assetId: string,
    @Param('channelName') channelName: string
  ) {
    return this.assetService.getChannelDataPoints(assetId, channelName);
  }

  @Get(':id/channels/:channelName/stats')
  getChannelStats(
    @Param('id') assetId: string,
    @Param('channelName') channelName: string
  ) {
    return this.assetService.getChannelStats(assetId, channelName);
  }
}
