import { ApiProperty } from '@nestjs/swagger';

export class SupportStatusDto {
  @ApiProperty()
  status: boolean;
}
