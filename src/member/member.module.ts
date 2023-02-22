import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MemberService } from './member.service';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 1000 * Number(process.env.ALL_MEMBER_TIMEOUT || '5'),
        baseURL: process.env.ALL_MEMBER,
      }),
    }),
  ],
  providers: [MemberService],
  exports: [MemberService],
})
export class MemberModule {}
