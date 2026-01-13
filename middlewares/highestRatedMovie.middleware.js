export function highestRatedMovies(req, res, next) {
  req.filters = {
    limit: 5,
    sort: "-rating",
  };

  next();
}
