import { User } from "../models/user.model.js";
import { asyncErrorHandler } from "../utlis/asyncError.js";

export const signup = asyncErrorHandler(async (req, res, next) => {
  const newUser = await User.create(req.body);

  res.status(200).json({
    status: "success",
    message: "User created successfully!!",
    data: {
      user: newUser,
    },
  });
});
