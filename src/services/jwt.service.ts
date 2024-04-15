const { verify, sign } = require("jsonwebtoken");

export function generateToken(data: any) {
  return sign(data, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function generateRefreshToken(data: any) {
  return sign(data, process.env.JWT_SECRET, {
    expiresIn: "2d",
  });
}

export function checkToken(data: any) {
  try {
    return verify(data, process.env.JWT_SECRET);
  } catch (e) {
    return false;
  }
}
