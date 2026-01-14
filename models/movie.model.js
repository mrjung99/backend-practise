import mongoose from "mongoose";

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

export const Movie = mongoose.model("Movie", movieSchema);
