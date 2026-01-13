import express from "express";
import {
  deleteMovie,
  getAllMovies,
  getMovie,
  postMovie,
  updateMovie,
} from "../controllers/movies.controller.js";
import {
  validateMovie,
  validateMovieId,
} from "../middlewares/validateMovie.middleware.js";
import { highestRatedMovies } from "../middlewares/highestRatedMovie.middleware.js";
export const movieRoute = express.Router();

// this middleware check the param with the name id and call the function checkeId
// movieRoute.param("id", checkId);

movieRoute.route("/").get(getAllMovies).post(validateMovie, postMovie);

// aliasing route ----> aliasing route means creating multiple URL paths (aliases) that all point to the same route handler. In other words, different routes behave the same way without duplicating code.
movieRoute.route("/highest-rated").get(highestRatedMovies, getAllMovies);

movieRoute
  .route("/:id")
  .all(validateMovieId)
  .get(getMovie)
  .patch(updateMovie)
  .delete(deleteMovie);
