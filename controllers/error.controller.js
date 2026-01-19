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
  const errors = Object.values(error.errors);
  const errorMsg = errors.map((err) => err.message).join(". ");
  return new CustomError(400, errorMsg);
};

const handleDuplicateError = (error) => {
  return new CustomError(
    400,
    `Movie name ${error.keyValue.name} already exist, enter another one.`,
  );
};

const productionErrors = (res, error) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      statusCode: error.statusCode,
      message: error.message,
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

    productionErrors(res, error);
  }
};
