import { asyncErrorHandler } from "../utlis/asyncError.js";
import { CustomError } from "../utlis/CustomError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const authenticateUser = asyncErrorHandler(async (req, res, next) => {
  //1. take the token and check if it exist
  const testToken = req.headers.authorization;

  let token;
  if (testToken && testToken.startsWith("bearer")) {
    token = testToken.split(" ")[1];
  }

  if (!token) {
    return next(new CustomError(401, "Unauthorized user, please login!!"));
  }

  //2. validate the token
  const decodedToken = jwt.verify(token, process.env.SECRET_STR);
  console.log(decodedToken);

  //3. if the user exist
  const user = await User.findById(decodedToken.payload._id);
  if (!user) {
    throw new CustomError(
      401,
      "User with the token doesn't exist please login agian!!",
    );
  }

  //4. if the token password is changed after token was issued
  const isPasswordChanged = await user.isPasswordChanged(decodedToken.iat);
  if (isPasswordChanged) {
    throw new CustomError(
      401,
      "Password changed, please enter the new password!!",
    );
  }

  //5. pass the control
  req.user = user;
  next();
});
