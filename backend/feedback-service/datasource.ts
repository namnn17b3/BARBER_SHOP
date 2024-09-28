import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
dotenv.config();

import { AppEnvironmentConfig } from '@common/enum/app-datasource.enum';
import { Logger } from '@nestjs/common';

let dataBaseConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: 'all',
  logger: 'advanced-console',
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/**/migrations/*.js'],
};

process.env.NODE_ENV = process.env.NODE_ENV.toUpperCase();

switch (process.env.NODE_ENV) {
  case AppEnvironmentConfig.DEV:
    dataBaseConfig = {
      ...dataBaseConfig,
      logging: 'all',
      logger: 'advanced-console',
    };
    break;
  case AppEnvironmentConfig.TEST:
    dataBaseConfig = {
      ...dataBaseConfig,
      database: process.env.DB_TEST_NAME,
      logging: 'all',
      logger: 'advanced-console',
    };
    break;
  case AppEnvironmentConfig.PRODUCTION:
    dataBaseConfig = {
      ...dataBaseConfig,
      logging: false,
      logger: 'file',
      host: '',
      port: +'',
      username: '',
      password: '',
      database: '',
    };
    break;
  default:
    break;
}

if (process.env.NODE_ENV === AppEnvironmentConfig.DEV) {
  Logger.debug(dataBaseConfig);
}

export const configValue = dataBaseConfig;

export const AppDataSource = new DataSource(dataBaseConfig);
