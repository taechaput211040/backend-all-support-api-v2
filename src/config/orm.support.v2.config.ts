import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Users } from 'src/entity/user.entity';

export default registerAs(
  'orm.support.v2.config',
  (): TypeOrmModuleOptions => ({
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
);
