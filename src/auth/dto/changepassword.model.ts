import { IsString } from 'class-validator';
import { AuthModel } from './auth.model';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordModel {
  @ApiProperty()
  @IsString()
  old_password: string;
  @ApiProperty()
  @IsString()
  new_password: string;
  @ApiProperty()
  @IsString()
  retype_new_password: string;
}
