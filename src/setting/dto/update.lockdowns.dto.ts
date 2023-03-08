import { IsBoolean, IsNumber, IsString, Length } from 'class-validator';

export class UpdateLockdownDto {
  // npm i --save class-validator class-transformer
  @IsString()
  operator: string;

  @IsString()
  company: string;

  @IsString()
  agent: string;

  @IsBoolean()
  status: boolean;
}
