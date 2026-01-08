import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

//this app must be imported before dotenv
import { app } from "./app.js";

// create a server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
