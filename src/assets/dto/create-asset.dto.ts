// create-asset.dto.ts
import { IsString, IsEnum, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AssetType } from "../asser-type.enum";
import { CreateDataChannelDto } from "./create-data-channel.dto";


export class CreateAssetDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  picture?: string;

  @IsEnum(AssetType)
  assetType: AssetType;

  @IsString()
  serial: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDataChannelDto)
  @IsOptional()
  dataChannels?: CreateDataChannelDto[];
}
