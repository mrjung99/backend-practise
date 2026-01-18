import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });
import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

//this app must be imported before dotenv
import { app } from "./app.js";
import { connectDB } from "./connectDB.js";

const PORT = process.env.PORT || 3000;
//connect to mongodb
const startServer = async () => {
  try {
    await connectDB(process.env.CONN_STR);
    console.log("Connection to DB successful...");

    app.listen(PORT, () => {
      console.log(`Server is running at port ${PORT}`);
    });
  } catch (error) {
    console.log(error.message);
  }
};

startServer();
