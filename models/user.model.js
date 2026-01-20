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

//instance method it is available for all the instances of User model
userSchema.methods.comparePassword = async function (pswd, paswdDB) {
  return bcrypt.compare(pswd, paswdDB);
};

export const User = mongoose.model("user", userSchema);
