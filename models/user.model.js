import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required."],
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    validate: [validator.isEmail, "Please enter a valid email."],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  confirmPassword: {
    type: String,
    required: [true, "Conform password is required."],
    validate: {
      validator: function (val) {
        return val == this.password;
      },
      message: "Password doesn't match, enter agian.",
    },
  },
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 12);

  this.confirmPassword = undefined;
});

export const User = mongoose.model("user", userSchema);
