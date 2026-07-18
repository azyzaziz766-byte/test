import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from './users/domain/user.entity';
import { Product } from './products/products.entity/products.entity';

export default new DataSource({
  type: 'mysql',

  host: process.env.DB_HOST,

  port: 3306,

  username: process.env.DB_USER,

  password: process.env.DB_PASSWORD,

  database: process.env.DB_NAME,

  entities: [User, Product],

  migrations: ['src/migrations/*.ts'],
});
