import { DataSource } from "typeorm";
import { Customer } from "../../../modules/customers/infra/typeorm/entities/Customer";
import dotenv from "dotenv";
import { Invoice } from "../../../modules/invoices/infra/entities/Invoice";
dotenv.config();

export const PostgresDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Customer, Invoice],
});

export const initializeDatabase = async () => {
  try {
    await PostgresDataSource.initialize();
    console.info("Data Source has been initialized!");
  } catch (err) {
    console.error("Error during Data Source initialization", err);
  }
};
