export function highestRatedMovies(req, res, next) {
  (req.query.limit = "5"), (req.query.sort = "rating");

  next();
}
