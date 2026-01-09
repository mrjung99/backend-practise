import mongoose, { Types } from "mongoose";

const movieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required!!"],
    unique: true,
  },
  description: String,
  duration: {
    type: Number,
    required: [true, "Duration is required!!"],
  },
  rating: {
    type: Number,
    default: 1.0,
  },
});

export const Movie = mongoose.model("Movie", movieSchema);
