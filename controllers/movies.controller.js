// import fs from "fs";
import { Movie } from "../models/movie.model.js";
import { ApiFeatures } from "../utlis/ApiFeatures.js";
import { asyncErrorHandler } from "../utlis/asyncError.js";
import { CustomError } from "../utlis/CustomError.js";

//read file from data/movies.json
// const movies = JSON.parse(fs.readFileSync("./data/movies.json"));

//*fucntion to check id (middleware callback function)
// export function checkId(req, res, next, value) {
//   let findMovie = movies.filter((m) => m.id === Number(value));
//   if (!findMovie) {
//     return res.status(404).json({
//       success: false,
//       message: `Movies with the id ${value} not found!!`,
//     });
//   }

//   next();
// }

//*--------------- send all movies when get request ------------------
export const getAllMovies = asyncErrorHandler(async (req, res) => {
  const finalQuery = {
    ...req.query,
    ...req.filters,
  };

  const apiFeature = new ApiFeatures(Movie.find(), finalQuery)
    .numericFilter()
    .selectField()
    .sort()
    .paginate();

  const movies = await apiFeature.query;

  // //*numberic filter
  // let queryObj = {};
  // if (finalQuery.numericFilter) {
  //   const operatorMap = {
  //     "<": "$lt",
  //     ">": "$gt",
  //     "=": "$eq",
  //     "<=": "$lte",
  //     ">=": "$gte",
  //   };

  //   const regEx = /\b(>=|<=|>|<|=)\b/g;
  //   //earn>100 -> earn-$gt-100
  //   let filters = finalQuery.numericFilter.replace(
  //     regEx,
  //     (match) => `-${operatorMap[match]}-`
  //   );

  //   const options = ["earn", "rating"];
  //   //earn-$gt-100 --> [earn,$gt,100] or [field=earn, operator=$gt, value=100]
  //   filters = filters.split(",").forEach((item) => {
  //     const [field, operator, value] = item.split("-");

  //     if (options.includes(field)) {
  //       queryObj[field] = { [operator]: Number(value) };
  //     }
  //   });
  // }

  // if (finalQuery.name) {
  //   queryObj.name = { $regex: finalQuery.name, $options: "i" };
  // }

  // let results = Movie.find(queryObj);

  // //*------ sorting-----
  // if (finalQuery.sort) {
  //   results = results.sort(finalQuery.sort.split(",").join(" "));
  // }

  // //*---select specific field
  // if (finalQuery.select) {
  //   results = results.select(select.split(",").join(" "));
  // } else {
  // //"-__v" excludes the __v :0 fields which mongo automatically create at the db creation time
  //   results = results.select("-__v");
  // }

  //*----pagination
  // const page = Number(finalQuery.page || 1);
  // const limit = Number(finalQuery.limit || 10);
  // const skip = (page - 1) * limit;
  // results = results.skip(skip).limit(limit);

  // if (finalQuery.page) {
  //   const movieCount = await Movie.countDocuments();
  //   if (skip >= movieCount) {
  //     throw new Error("No movies found on this page!!");
  //   }
  // }

  // const movies = await results;

  res.status(200).json({
    status: "success",
    length: movies.length,
    data: {
      movies,
    },
  });
});

//*---------------get movie with the id-----------
export const getMovie = asyncErrorHandler(async (req, res) => {
  // const movie = await Movie().find({_id:req.params.id})
  const movie = await Movie.findById(req.params.id);

  if (!movie) {
    throw new CustomError(
      404,
      `Movie with the id ${req.params.id} is not found!!`,
    );
  }

  res.status(200).json({
    status: "success",
    data: {
      movie,
    },
  });
});

//--------------------- add or post movie ----------------------
export const postMovie = asyncErrorHandler(async (req, res) => {
  const movie = await Movie.create(req.body);
  res.status(200).json({
    status: "success",
    message: "Movie added successfully!",
    data: {
      movie,
    },
  });
});

// ------------------- update movie (patch) -------------------
export const updateMovie = asyncErrorHandler(async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    throw new CustomError(401, "Invalid movie!!");
  }

  const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!movie) {
    throw new CustomError(
      404,
      `Movie with the id ${req.params.id} does not exist!!`,
    );
  }

  res.status(200).json({
    status: "success",
    message: "Movie updated successfully.",
    data: {
      movie,
    },
  });
});

// ------------------------- delete movie -----------------------------
export const deleteMovie = asyncErrorHandler(async (req, res) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);

  if (!movie) {
    throw new CustomError(
      404,
      `Movie with the id ${req.params.id} does not exist!!`,
    );
  }

  res.status(204).json({
    status: "success",
    message: "Movie deleted successfully.",
  });
});

// -----aggretation pipeline ----
export const getMovieStats = asyncErrorHandler(async (req, res) => {
  const stat = await Movie.aggregate([
    { $match: { rating: { $gte: 5 } } },
    {
      $group: {
        _id: "$releaseYear",
        maxPrice: { $max: "$earn" },
        minPrice: { $min: "$earn" },
        avgPrice: { $avg: "$earn" },
        avgRating: { $avg: "$rating" },
        maxRating: { $max: "$rating" },
        minRating: { $min: "$rating" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.status(200).json({
    status: "success",
    length: stat.length,
    data: {
      stat,
    },
  });
});

export const getMoviesByGenre = asyncErrorHandler(async (req, res) => {
  const genre = req.params.genre;
  const movies = await Movie.aggregate([
    { $unwind: "$genres" },
    {
      $group: {
        _id: "$genres",
        moviesCout: { $sum: 1 },
        movies: { $push: "$name" },
      },
    },
    { $addFields: { genre: "$_id" } },
    { $project: { _id: 0 } },
    { $sort: { moviesCout: -1 } },
    { $match: { genre: genre } },
  ]);

  res.status(200).json({
    status: "success",
    length: movies.length,
    data: {
      movies,
    },
  });
});
