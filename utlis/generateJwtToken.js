import jwt from "jsonwebtoken";

export function generateJwtToken(payload) {
  return jwt.sign({ payload }, process.env.SECRET_STR);
}
