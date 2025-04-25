import { Server } from "http";
import httpServer from "./app";
import config from "./app/config";
import mongoose from "mongoose";

let server: Server;

async function main() {

  try {
    server = httpServer.listen(config.port, () => {
      mongoose
        .connect(config.database_url as string)
        .then(() => console.log("Connected to MongoDB"))
        .catch((err) => console.error("Failed to connect to MongoDB", err));
      if (config.NODE_ENV === "development") {
        console.log(`✔ Server started at http://localhost:${config.port}`);
      } else {
        console.log(`✔ Server started at ${config.port} `);
      }
    });
  } catch (err) {
    console.log("Error starting server:", err);
  }

  // handle unHandledRejection
  process.on("unhandledRejection", (err) => {
    console.log("UNHANDLED REJECTION... 💥. Process Terminated", err);

    if (server) {
      server.close(() => {
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
}

main();

// handle uncaughtExceptions
process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception...😓. Process Terminated", err);
  process.exit(1);
});

process.on("SIGTERM", (err) => {
  console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => {
    console.log("💥 Process terminated!", err);
    process.exit(1);
  });
});
