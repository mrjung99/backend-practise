import mongoose from "mongoose";

// check all movie fields are filled or not
export function validateMovie(req, res, next) {
  const errors = [];
  if (!req.body.name)
    errors.push({ field: "movieName", message: "Movie name required!!" });
  if (!req.body.rating)
    errors.push({ field: "rating", message: "Rating is required!!" });
  if (!req.body.duration)
    errors.push({ field: "duration", message: "Enter movie duration!!" });

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Not a valid movie.",
      errors: errors,
    });
  }

  next();
}

// check for the movie id is valid or not for put,delete,patch, get method
export function validateMovieId(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res
      .status(401)
      .json({ success: false, message: "Movie id is not valid!!" });
  }

  next();
}
