import { IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateDataChannelDto } from './create-data-channel.dto';

export class AddDataChannelDto extends CreateDataChannelDto {
  @IsString()
  assetId: string;
}
