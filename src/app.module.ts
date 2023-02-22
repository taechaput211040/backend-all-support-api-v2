import { Module } from '@nestjs/common';
import { SettingModule } from './setting/setting.module';
import { MemberModule } from './member/member.module';
import { SupportModule } from './support/support.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
    }),
    TypeOrmModule.forRoot({
      name: 'all_setting',
      type: 'cockroachdb',
      host: process.env.DB_SETTING_HOST,
      port: Number(process.env.DB_SETTING_PORT),
      username: process.env.DB_SETTING_USER,
      password: process.env.DB_SETTING_PASSWORD,
      database: process.env.DB_SETTING_NAME,
      entities: [],
      synchronize: false,
      ssl: {
        rejectUnauthorized: false,
      },
    }),
    SettingModule,
    MemberModule,
    SupportModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
