import fs from "fs";
import { Movie } from "../models/movie.model.js";

//read file from data/movies.json
const movies = JSON.parse(fs.readFileSync("./data/movies.json"));

//fucntion to check id (middleware callback function)
export function checkId(req, res, next, value) {
  let findMovie = movies.filter((m) => m.id === Number(value));
  if (!findMovie) {
    return res.status(404).json({
      success: false,
      message: `Movies with the id ${value} not found!!`,
    });
  }

  next();
}

//--------------- send all movies when get request ------------------
export async function getAllMovies(req, res) {
  try {
    const movies = await Movie.find();
    res.status(200).json({
      success: true,
      length: movies.length,
      data: {
        movies,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(404).json({ success: false, message: error.message });
  }
}

//---------------get movie with the id-----------
export async function getMovie(req, res) {
  try {
    // const movie = await Movie().find({_id:req.params.id})
    const movie = await Movie.findById(req.params.id);
    res.status(200).json({
      success: true,
      data: {
        movie,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(404).json({ success: false, message: error.message });
  }
}

//--------------------- add or post movie ----------------------
export async function postMovie(req, res) {
  try {
    const movieToPost = await Movie.create(req.body);
    res.status(200).json({
      success: true,
      message: "Movie added successfully!",
      data: {
        movie: movieToPost,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(401).json({ success: false, message: "Something went wrong." });
  }
}

// -------------------- update movie (patch) -------------------
export function updateMovie(req, res) {
  const id = Number(req.params.id);

  let findMovie = movies.filter((m) => m.id === id);

  const index = movies.indexOf(findMovie);
  //we have to pass req.body with spread operator coz body is the properties of req object so, body:req.body will work or body = req.body and passing body with {..findMovie, body} it will works also
  const updatedMovie = { ...findMovie, ...req.body };

  movies[index] = updatedMovie;

  fs.writeFile("./data/movies.json", JSON.stringify(movies), (err) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Something went wrong !!" });
    }

    res.status(200).json({
      success: true,
      message: "Movie updated successfully!!",
      data: {
        movie: updatedMovie,
      },
    });
  });
}

// ------------------------- delete movie -----------------------------
export function deleteMovie(req, res) {
  const id = Number(req.params.id);
  const movieToDelete = movies.filter((m) => m.id === id);

  const index = movies.indexOf(movieToDelete);
  movies.splice(index, 1);

  fs.writeFile("./data/movies.json", JSON.stringify(movies), (err) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Something went wrong !!" });
    }

    res.status(200).json({
      success: true,
      message: "Movie deleted successfully!!",
    });
  });
}
