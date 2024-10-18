import http from "http";
import { initializeDatabase } from "../database/DatabaseConnection";
import { app } from "../../app";

const startServer = async () => {
  await initializeDatabase();

  const httpServer = http.createServer(app);
  httpServer.listen(process.env.PORT, () => {
    console.info("My app is running");
  });
};

startServer();
