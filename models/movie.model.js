import mongoose from "mongoose";
import fs from "fs";
import { log } from "console";

const movieSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required!!"],
      unique: true,
      trim: true,
    },
    description: String,
    duration: {
      type: Number,
      required: [true, "Duration is required!!"],
      trim: true,
    },
    rating: {
      type: Number,
    },
    releaseYear: {
      type: Number,
      required: [true, "Release year is required field!"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    createdBy: String,
    genres: {
      type: [String],
      required: [true, "Genres is required field!"],
    },
    directors: {
      type: [String],
      required: [true, "Directors is required field!"],
    },
    poster: {
      type: String,
      required: [true, "Poster is required field!"],
    },
    actors: {
      type: String,
      required: [true, "Actors is required field!"],
    },
    earn: {
      type: Number,
      required: [true, "Price is required field!"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//virtual properties
movieSchema.virtual("durationInHours").get(function () {
  return this.duration / 60;
});

//!document middleware
//works with save(), remove() not with findByIdAndUpdate() etc
movieSchema.pre("save", function () {
  this.createdBy = "Daulat";
});

movieSchema.post("save", function (doc) {
  const content = `${doc.name} is created by ${doc.createdBy}`;
  // console.log(`${doc.name} is created by ${doc.createdBy}`);
  // here the {flag:"a"} is used to append the new log on previous log on the file if we dont do that it will rewrite the whole file
  fs.writeFileSync("./log/log.txt", content, { flag: "a" }, (err) => {
    console.log(err);
  });
});

//! query middleware
// here this find query works with getAllMovies() controller but not with the patch and update bcoz  findByIdAndUpdate is different then find query so we use regex /^find/ so it will works for all the query starting with find.
movieSchema.pre(/^find/, async function () {
  console.log("query middleware is called");
  this.find({ releaseYear: { $lte: new Date().getFullYear() } });
  this.startTime = Date.now();
});

movieSchema.post(/^find/, function () {
  this.endTime = Date.now();
  const content = `\nQuery took ${
    this.endTime - this.startTime
  } ms to fetch document.`;

  fs.writeFileSync("./log/log.txt", content, { flag: "a" }, (err) => {
    console.log(err);
  });
});

//! aggregation middleware
movieSchema.pre("aggregate", function () {
  console.log(
    this.pipeline().unshift({
      $match: { releaseYear: { $lte: new Date().getFullYear() } },
    })
  );
});

export const Movie = mongoose.model("Movie", movieSchema);
