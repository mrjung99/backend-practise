import { CustomError } from "../utlis/CustomError.js";

const developmentErros = (res, error) => {
  res.status(error.statusCode).json({
    status: error.status,
    statusCode: error.statusCode,
    message: error.message,
    stackTrace: error.stack,
    error: error,
  });
};

const handleCastError = (error) => {
  const errMsg = `Invalid value for ${error.path}: ${error.value}`;
  return new CustomError(400, errMsg);
};

const handleRequiredError = (error) => {
  const errors = {};
  const errorMsg = Object.values(error.errors).forEach(
    (err) => (errors[err.path] = err.message),
  );
  return new CustomError(400, "Validation error!!", errors);
};

const handleDuplicateError = (error) => {
  const dupKey = Object.keys(error.keyPattern);
  const key = dupKey[0].charAt(0).toUpperCase() + dupKey[0].slice(1);
  return new CustomError(400, `${key} is already taken, enter another one.`);
};

const handleExpredJwt = (error) => {
  return new CustomError(401, "Token exprired, please login again!!");
};

const handleWebTokenError = (error) => {
  return new CustomError(401, "Invalid token please login again!!");
};

const productionErrors = (res, error) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      statusCode: error.statusCode,
      message: error.message,
      ...(error.errors && { errors: error.errors }),
    });
  } else {
    res
      .status(500)
      .json({ status: "error", message: "Something went wrong try again!!" });
  }
};

export const globalErrorHandler = (error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  if (process.env.NODE_ENV === "development") {
    developmentErros(res, error);
  } else if (process.env.NODE_ENV === "production") {
    if (error.name === "CastError") error = handleCastError(error);
    if (error.name === "ValidationError") error = handleRequiredError(error);
    if (error.code === 11000) error = handleDuplicateError(error);
    if (error.name === "TokenExpiredError") error = handleExpredJwt(error);
    if (error.name === "JsonWebTokenError") error = handleWebTokenError(error);

    productionErrors(res, error);
  }
};
