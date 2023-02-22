import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberModule } from 'src/member/member.module';
import { SettingService } from './setting.service';

@Module({
  imports: [
    MemberModule,
    TypeOrmModule.forFeature([], 'all_setting'),
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 1000 * Number(process.env.ALL_SUPPORT_V1_TIMEOUT || '5'),
        baseURL: process.env.ALL_SUPPORT_V1,
      }),
    }),
  ],
  providers: [SettingService],
  exports: [SettingService],
})
export class SettingModule {}
