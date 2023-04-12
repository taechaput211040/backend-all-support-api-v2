import { Module } from '@nestjs/common';
import { SettingModule } from './setting/setting.module';
import { MemberModule } from './member/member.module';
import { SupportModule } from './support/support.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lockdowns } from './entity/v1/lockdowns.entity';
import { AuthModule } from './auth/auth.module';
import { Users } from './entity/user.entity';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),

    TypeOrmModule.forRoot({
      name: 'support',
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Lockdowns],
      synchronize: false, //dont sync
      // synchronize: process.env.DB_SYNC == 'true',
      ssl: false,
    }),
    TypeOrmModule.forRoot({
      name: 'all_setting',
      type: 'postgres',
      host: process.env.DB_SETTING_HOST,
      port: Number(process.env.DB_SETTING_PORT),
      username: process.env.DB_SETTING_USER,
      password: process.env.DB_SETTING_PASSWORD,
      database: process.env.DB_SETTING_NAME,
      entities: [],
      synchronize: false,
    }),
    TypeOrmModule.forRoot({
      name: 'support_v2',
      type: 'postgres',
      host: process.env.DB_SUPPORT_V2_HOST,
      port: Number(process.env.DB_SUPPORT_V2_PORT),
      username: process.env.DB_SUPPORT_V2_USER,
      password: process.env.DB_SUPPORT_V2_PASSWORD,
      database: process.env.DB_SUPPORT_V2_NAME,
      entities: [Users],
      synchronize: process.env.DB_SUPPORT_V2_SYNC == 'true',
    }),
    SettingModule,
    MemberModule,
    SupportModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
