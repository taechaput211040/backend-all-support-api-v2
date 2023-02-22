import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { SettingModule } from 'src/setting/setting.module';
import { SupportController } from './support.controller';
import { SupportService } from './support.service';

@Module({
  imports: [
    SettingModule,
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 1000 * Number(process.env.SMART_TIMEOUT || '5'),
        baseURL: process.env.SMART_URL,
      }),
    }),
  ],
  controllers: [SupportController],
  providers: [SupportService],
})
export class SupportModule {}
