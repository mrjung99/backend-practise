import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
dotenv.config({ path: "./config.env" });
import { Movie } from "../models/movie.model.js";

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

const movieFile = JSON.parse(fs.readFileSync("./data/movies.json", "utf-8"));

//delete all movie from the db collection Movies
const deleteAllMovie = async () => {
  try {
    await Movie.deleteMany();
    console.log("All movie deleted successfully.");
  } catch (error) {
    console.log(error.message);
  }
  process.exit();
};

// inset all the movie from the file movies.json to the the db collection Movies
const insertMovieList = async () => {
  try {
    await Movie.create(movieFile);
    console.log("All movie from the file is inserted successfully.");
  } catch (error) {
    console.log(error.message);
  }

  process.exit();
};

if (process.argv[2] === "--delete") {
  deleteAllMovie();
}

if (process.argv[2] === "--insert") {
  insertMovieList();
}
