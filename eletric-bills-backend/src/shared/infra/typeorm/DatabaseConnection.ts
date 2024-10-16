import { DataSource } from "typeorm";
import { Customer } from "../../../modules/customers/infra/typeorm/entities/Customer";
import { Bill } from "../../../modules/bills/infra/entities/Bill";
import dotenv from "dotenv";
dotenv.config();

export const PostgresDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Customer, Bill],
});

export const initializeDatabase = async () => {
  try {
    await PostgresDataSource.initialize();
    console.info("Data Source has been initialized!");
  } catch (err) {
    console.error("Error during Data Source initialization", err);
  }
};
