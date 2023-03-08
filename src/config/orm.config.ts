import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Lockdowns } from 'src/entity/lockdowns.entity';

export default registerAs(
  'orm.config',
  (): TypeOrmModuleOptions => ({
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
);
