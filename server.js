import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });
import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

// uncaught exception error
process.on("uncaughtException", (err) => {
  console.log("Uncaught exception occur!!");
  console.log(err.name, err.message);
  process.exit(1);
});

//this app must be imported before dotenv
import { app } from "./app.js";

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.CONN_STR).then(() => {
  console.log("Connection to DB is successful.");
});

let server = app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});

// unhandled rejection error
process.on("unhandledRejection", (err) => {
  console.log("Unhandled rejection occured shutting down...");
  console.log(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});
