import express from "express";
import {
  checkId,
  deleteMovie,
  getAllMovies,
  getMovie,
  postMovie,
  updateMovie,
} from "../controllers/movies.controller.js";
import { validateMovie } from "../middlewares/validateMovie.middleware.js";

export const movieRoute = express.Router();

// this middleware check the param with the name id and call the function checkeId
movieRoute.param("id", checkId);

movieRoute.route("/").get(getAllMovies).post(validateMovie, postMovie);

movieRoute.route("/:id").get(getMovie).patch(updateMovie).delete(deleteMovie);
