import { DataSource } from 'typeorm';
import { User } from 'src/users/domain/user.entity';
import { Product } from 'src/products/products.entity/products.entity';
import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({

  type: 'mysql',

  host: process.env.DB_HOST,

  port: Number(process.env.DB_PORT),

  username: process.env.DB_USERNAME,

  password: process.env.DB_PASSWORD,

  database: process.env.DB_NAME,

  entities: [
    User,
    Product,
  ],

  migrations: [
    'src/database/migrations/*.ts',
  ],

});