import { DataSource } from "typeorm";
import { Consumption } from "../../../domain/entities/Consumption";
import { Customer } from "../../../domain/entities/Customer";
import { Invoice } from "../../../domain/entities/Invoice";
import { InvoiceItem } from "../../../domain/entities/InvoiceItem";
import { InvoiceItemType } from "../../../domain/entities/InvoiceItemType";
import dotenv from "dotenv";
dotenv.config();
export const PostgresDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Customer, Invoice, InvoiceItem, InvoiceItemType, Consumption],
  migrations: [__dirname + "/migrations/*.ts"],
  synchronize: false,
});
