import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { DataPointDto } from './data-point.dto';

export class CreateDataChannelDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  key?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  unit: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DataPointDto)
  dataPoints: DataPointDto[];
}
