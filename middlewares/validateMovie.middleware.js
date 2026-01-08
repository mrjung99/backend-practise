export function validateMovie(req, res, next) {
  const errors = [];
  if (!req.body.name)
    errors.push({ field: "movieName", message: "Movie name required!!" });
  if (!req.body.release)
    errors.push({ field: "releaseDate", message: "Release date required!!" });
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
