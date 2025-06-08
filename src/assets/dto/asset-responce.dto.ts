import { ApiProperty } from '@nestjs/swagger';
import { AssetType } from "../asser-type.enum";


export class DataPointResponse {
  @ApiProperty()
  t: number;

  @ApiProperty()
  v: number;
}

export class DataChannelResponse {
  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  key?: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty()
  unit: string;

  @ApiProperty({ type: [DataPointResponse] })
  dataPoints: DataPointResponse[];
}

export class AssetResponseDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false })
  picture?: string;

  @ApiProperty({ enum: Object.values(AssetType) })
  assetType: AssetType;

  @ApiProperty()
  serial: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ type: [DataChannelResponse] })
  dataChannels: DataChannelResponse[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
