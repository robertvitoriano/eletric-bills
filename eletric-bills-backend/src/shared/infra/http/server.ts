import { initializeDatabase } from "../typeorm/DatabaseConnection";
import http from "http";
import { app } from "./../../app";

const startServer = async () => {
  await initializeDatabase();

  const httpServer = http.createServer(app);
  httpServer.listen(3334, () => {
    console.info("My app is running");
  });
};

startServer();
