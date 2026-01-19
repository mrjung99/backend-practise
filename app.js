import express from "express";
import { movieRoute } from "./routes/movie.route.js";
import { CustomError } from "./utlis/CustomError.js";
import { globalErrorHandler } from "./controllers/error.controller.js";

export const app = express();

//middleware
app.use(express.json());
// app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/api/movies", movieRoute);

app.all(/.*/, (req, res) => {
  throw new CustomError(404, `Can't find ${req.originalUrl} on server.`);
});

//global error handling
app.use(globalErrorHandler);
