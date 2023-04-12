import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AuthModel {
  // npm i --save class-validator class-transformer
  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsString()
  password: string;
}
