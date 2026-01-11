// import fs from "fs";
import { Movie } from "../models/movie.model.js";

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

//--------------- send all movies when get request ------------------
export async function getAllMovies(req, res) {
  try {
    const { name, sort, select, numericFilter } = req.query;
    let queryObj = {};

    //numberic filter
    if (numericFilter) {
      const operatorMap = {
        "<": "$lt",
        ">": "$gt",
        "=": "$eq",
        "<=": "$lte",
        ">=": "$gte",
      };

      const regEx = /\b>|< | =|<= |>=\b/;
      //earn>100 -> earn-$gt-100
      let filters = numericFilter.replace(
        regEx,
        (match) => `-${operatorMap[match]}-`
      );

      const options = ["earn", "rating"];
      //earn-$gt-100 --> [earn,$gt,100] or [field=earn, operator=$gt, value=100]
      filters = filters.split(",").forEach((item) => {
        const [field, operator, value] = item.split("-");

        if (options.includes(field)) {
          queryObj[field] = { [operator]: Number(value) };
        }
      });
    }

    if (name) {
      queryObj.name = { $regex: name, $options: "i" };
    }

    let results = Movie.find(queryObj);

    //------ sorting-----
    if (sort) {
      results = results.sort(sort.split(",").join(" "));
    }

    //---select specific field
    if (select) {
      results = results.select(select.split(",").join(" "));
    }

    //----pagination
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const skip = (page - 1) * limit;
    results = results.skip(skip).limit(limit);

    const movies = await results;

    if (!movies || movies.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No Movies found!!" });
    }

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

    if (!movie) {
      res.status(401).json({ success: false, message: "Movie not found!!" });
    }

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
    const movie = await Movie.create(req.body);
    res.status(200).json({
      success: true,
      message: "Movie added successfully!",
      data: {
        movie,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ success: false, message: "Something went wrong." });
  }
}

// ------------------- update movie (patch) -------------------
export async function updateMovie(req, res) {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid movie!" });
    }

    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: `Movie with the id ${req.params.id} does not exist!!`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Movie updated successfully.",
      data: {
        movie,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(404).json({ success: false, message: error.message });
  }
}

// ------------------------- delete movie -----------------------------
export async function deleteMovie(req, res) {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);

    if (!movie) {
      return res.status(401).json({
        success: false,
        message: `Movie with id ${req.params.id} does not exist.`,
      });
    }

    res.status(204).json({
      success: true,
      message: "Movie deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(404).json({ success: false, message: error.message });
  }
}
