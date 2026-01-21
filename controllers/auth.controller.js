import { User } from "../models/user.model.js";
import { asyncErrorHandler } from "../utlis/asyncError.js";
import { CustomError } from "../utlis/CustomError.js";
import { generateJwtToken } from "../utlis/generateJwtToken.js";

//-----------User signup----------------
export const signup = asyncErrorHandler(async (req, res, next) => {
  const newUser = await User.create(req.body);
  const { password, __v, ...withoutPass } = newUser._doc;
  //or we can set select:false to the password property in the user schema to avoid it

  const jwtToken = generateJwtToken(withoutPass);

  res.status(200).json({
    status: "success",
    token: jwtToken,
    message: "User created successfully!!",
    data: {
      user: withoutPass,
    },
  });
});

// ----------------User sign in--------------
export const signIn = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError(400, "Email and password is required.");
  }

  const user = await User.findOne({ email });
  const isPassMatched = await user.comparePassword(password, user.password);

  if (!user || !isPassMatched) {
    throw new CustomError(400, "Invalid password or email.");
  }

  const token = generateJwtToken(user);

  res
    .status(200)
    .json({ status: "success", token, message: "Loged in Successfully." });
});
