import { HttpModule } from '@nestjs/axios';
import { CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberModule } from 'src/member/member.module';
import { SettingService } from './setting.service';
import * as redisStore from 'cache-manager-redis-store';
import { Lockdowns } from 'src/entity/v1/lockdowns.entity';

@Module({
  imports: [
    MemberModule,
    TypeOrmModule.forFeature([Lockdowns], 'support'),
    CacheModule.register({
      store: redisStore,
      host: process.env.REDIS_SERVER,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
      ttl: null,
      db: 4,
    }),
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
