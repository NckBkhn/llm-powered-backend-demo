import { IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { DataPointDto } from './data-point.dto';

export class AddDataPointsDto {
  @IsString()
  assetId: string;

  @IsString()
  channelName: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DataPointDto)
  dataPoints: DataPointDto[];
}
