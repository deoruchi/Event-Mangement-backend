import userModel from "../models/user.model.js";
import AppiError from "../utils/ApiError.js";
import jwt, { decode } from "jsonwebtoken";
const verifyJwt = async (req, res, next) => {
  //get the access token
  //token from header
  const token = req.headers?.authorization.split(" ")[1];
  //token from cookies
  const cToken = req.cookies?.access_token;

  const userToken = cToken || token;

  if (!userToken) throw new AppiError("404", "User is not logged in");
  const decoded = jwt.verify(userToken, process.env.ACCESS_TOKEN_KEY);
  console.log(decoded);
  const user = await userModel
    .findOne({ _id: decoded?._id })
    .select("-password -refreshtoken");

  if (!user) throw new AppiError(404, "Not found");

  req.user = user;
  next();
};

export default verifyJwt;
