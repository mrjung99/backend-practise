import fs from "fs";

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
export function getMovies(req, res) {
  res.status(200).json({
    success: true,
    data: {
      movies: movies,
    },
  });
}

//---------------get movie with the id-----------
export function getMovie(req, res) {
  const id = Number(req.params.id);
  const findMovie = movies.filter((m) => m.id === id);

  //*this will be handle by middleware and the callback func. name is checkId
  /*if (!findMovie) {
    return res
      .status(404)
      .json({ success: false, message: `Movie with the id ${id} not found!!` });
  }*/

  res.status(200).json({
    success: true,
    message: "Movie found.",

    data: {
      movie: findMovie,
    },
  });
}

//--------------------- add or post movie ----------------------
export function postMovie(req, res) {
  const id = movies.length + 1;
  movies.push({ id, ...req.body });

  fs.writeFile("./data/movies.json", JSON.stringify(movies), (err) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Movie can't be added!" });
    }

    res.status(201).json({ success: true, message: "Created" });
  });
}

// -------------------- update movie (patch) -------------------
export function updateMovie(req, res) {
  const id = Number(req.params.id);

  let findMovie = movies.filter((m) => m.id === id);
  /* if (!findMovie) {
    return res.status(404).json({
      success: false,
      message: `Movies with the id ${id} not found!!`,
    });
  }*/

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
