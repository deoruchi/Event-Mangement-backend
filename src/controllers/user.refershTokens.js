import jwt from "jsonwebtoken";
import generateAccessandRefreshToken from "./authsHelpers/tokenGenerator.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const refreshTokens = async (req, res, next) => {
  const r_token = req.cookies?.refreshtoken;
  //check for the logout
  if (!r_token) {
    res.json(
      new ApiResponse(
        200,
        {},
        "User Logged Out/ User not registered login in again"
      )
    );
  }

  let expire_time = await jwt.decode(r_token).exp;
  let user_id = await jwt.decode(r_token)._id;
  const currentTime = Date.now();

  if (currentTime >= expire_time) {
    // Initiate refresh token request
    const { access_token, refresh_token } = await generateAccessandRefreshToken(
      user_id
    );
    return res
      .status(200)
      .cookie("accestoken", access_token, process.env.HTTP_OPTION)
      .cookie("refreshtoken", refresh_token, process.env.HTTP_OPTION)
      .json(
        new ApiResponse(
          200,
          {
            ID: user_id,
            access_token,
            refresh_token,
          },
          "Access token expired. Initiating refresh process."
        )
      );
  } else {
    res.send("Access token is still valid.");
    next();
  }
};

export default refreshTokens;
