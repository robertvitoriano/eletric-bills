import dotenv from "dotenv";
import { PostgresDataSource } from "./PostgresDataSource";

dotenv.config();

export const initializeDatabase = async () => {
  try {
    await PostgresDataSource.initialize();
  } catch (err) {
    console.error("Error during Data Source initialization", err);
  }
};

export const runMigrations = async () => {
  try {
    await PostgresDataSource.initialize();
    await PostgresDataSource.runMigrations();
    console.info("Migrations have been run successfully!");
  } catch (err) {
    console.error("Error during running migrations", err);
  } finally {
    await PostgresDataSource.destroy();
  }
};
