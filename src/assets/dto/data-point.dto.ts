import { IsNumber } from 'class-validator';

export class DataPointDto {
  @IsNumber()
  t: number;

  @IsNumber()
  v: number;
}
