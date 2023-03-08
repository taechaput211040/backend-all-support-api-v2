import { ApiProperty } from '@nestjs/swagger';
import { SupportStatusDto } from './support-status.dto';

export class SupportLockdownDto extends SupportStatusDto {
  @ApiProperty({
    default: 'api',
  })
  operator: string;
}
