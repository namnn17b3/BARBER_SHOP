import { DataSource } from 'typeorm';
import 'dotenv/config';
import { configValue } from 'datasource';

export default new DataSource(configValue);
