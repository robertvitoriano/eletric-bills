import http from "http";
import {
  initializeDatabase,
  runMigrations,
} from "../database/DatabaseConnection";
import { app } from "../../app";

const startServer = async () => {
  await runMigrations();
  await initializeDatabase();

  const httpServer = http.createServer(app);
  httpServer.listen(process.env.PORT, () => {
    console.info("My app is running");
  });
};

startServer();
