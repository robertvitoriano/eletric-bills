import http from "http";
import {
  initializeDatabase,
  runMigrations,
} from "../database/DatabaseConnection";
import { app } from "../../app";
import { seedInvoiceItemTypes } from "../database/seed/invoice-item-types";

const startServer = async () => {
  await runMigrations();
  await seedInvoiceItemTypes();
  await initializeDatabase();

  const httpServer = http.createServer(app);
  httpServer.listen(process.env.PORT, () => {
    console.info("My app is running on port " + process.env.PORT);
  });
};

startServer();
