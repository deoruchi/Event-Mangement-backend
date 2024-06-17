import userModel from "../../models/user.model.js";
import ApiError from "../../utils/ApiError.js";

const generateAccessandRefreshToken = async (userId) => {
  try {
    console.log(`user generator ${userId}`);

    const user = await userModel.findOne({ _id: userId });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const access_token = await user.generateAccessToken();
    const refresh_token = await user.generateRefreshToken();

    user.refreshtoken = refresh_token;
    const updatedUser = await userModel.updateOne({ _id: user._id }, user);
    if (updatedUser.modifiedCount === 1) {
      //   console.log("Refresh token updated successfully for user:", user._id);
      return { access_token, refresh_token };
    }
  } catch (error) {
    console.error("Error:", error); // Log the actual error for debugging
    throw new ApiError(
      400,
      "Something went wrong while extracting the user ID or getting user"
    );
  }
};

export default generateAccessandRefreshToken;
