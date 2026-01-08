import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });

//this app must be imported before dotenv
import { app } from "./app.js";

//connect to mongodb
mongoose
  .connect(process.env.CONN_STR)
  .then((conn) => {
    // console.log(conn);
    console.log("DB connection successful...");
  })
  .catch((err) => {
    console.error("DB connection failed:", err.message);
    process.exit(1); // Exit process on connection failure
  });

// create a server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
