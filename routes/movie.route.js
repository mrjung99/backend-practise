import express from "express";
import {
  deleteMovie,
  getAllMovies,
  getMovie,
  getMoviesByGenre,
  getMovieStats,
  postMovie,
  updateMovie,
} from "../controllers/movies.controller.js";
import { highestRatedMovies } from "../middlewares/highestRatedMovie.middleware.js";
import { authenticateUser } from "../middlewares/authenticate.user.middleware.js";
export const movieRoute = express.Router();

// this middleware check the param with the name id and call the function checkeId
// movieRoute.param("id", checkId);

movieRoute.route("/").get(authenticateUser, getAllMovies).post(postMovie);
movieRoute.route("/:id").get(getMovie).patch(updateMovie).delete(deleteMovie);

//! aliasing route ----> aliasing route means creating multiple URL paths (aliases) that all point to the same route handler. In other words, different routes behave the same way without duplicating code.
movieRoute.route("/highest-rated").get(highestRatedMovies, getAllMovies);

//! aggregation pipeline ---> An aggregation pipeline is a MongoDB feature that processes data through multiple stages, where each stage transforms the documents before passing them to the next stage.
movieRoute.route("/movie-stats").get(getMovieStats);
movieRoute.route("/movies-by-genre/:genre").get(getMoviesByGenre);
