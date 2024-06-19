import userModel from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import generateAccessandRefreshToken from "./authsHelpers/tokenGenerator.js";

const userRegistration = async (req, res) => {
  //Any data sent using postman's formdata is considered as multipart/formdata.
  //You have to use multer or other similar library in order to parse formdata.
  try {
    const data = req.body;
    const newUser = new userModel(data);
    await newUser.save();
    res.status(200).json({ success: true });
  } catch (e) {
    throw new ApiError(404, e.message);
  }
};

//login
const userLogin = async (req, res) => {
  const { name, email, password, _id } = req.body;
  if (!email) {
    throw new ApiError(400, "User not found");
  }
  const user = await userModel.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const match = await user.compare_password(password);
  if (match) {
    //add jwt and save it in db
    const { access_token, refresh_token } = await generateAccessandRefreshToken(
      user._id
    );

    return res
      .status(200)
      .cookie("accestoken", access_token, process.env.HTTP_OPTION)
      .cookie("refreshtoken", refresh_token, process.env.HTTP_OPTION)
      .json(
        new ApiResponse(
          200,
          {
            user: user,
            access_token,
            refresh_token,
          },
          "User Logged IN"
        )
      );
  }
};

//logout
const logOutUser = async (req, res) => {
  //set the refresh token undefined
  await userModel.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshtoken: undefined },
    },
    { new: true }
  );

  return res
    .clearCookie("accesstoken", process.env.HTTP_OPTION)
    .clearCookie("refreshtoken", process.env.HTTP_OPTION)
    .json(new ApiResponse(200, {}, "User Logout"));
};

export { userRegistration, userLogin, logOutUser };
