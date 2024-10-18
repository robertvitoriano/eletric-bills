import dotenv from "dotenv";
import { DataSource } from "typeorm";
import { Consumption } from "../../../core/entities/Consumption";
import { Customer } from "../../../core/entities/Customer";
import { Invoice } from "../../../core/entities/Invoice";
import { InvoiceItem } from "../../../core/entities/InvoiceItem";

dotenv.config();

export const PostgresDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Customer, Invoice, InvoiceItem, Consumption],
});

export const initializeDatabase = async () => {
  try {
    await PostgresDataSource.initialize();
    console.info("Data Source has been initialized!");
  } catch (err) {
    console.error("Error during Data Source initialization", err);
  }
};
