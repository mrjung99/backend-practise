import mongoose from "mongoose";
import fs from "fs";

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

//document middleware
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

export const Movie = mongoose.model("Movie", movieSchema);
