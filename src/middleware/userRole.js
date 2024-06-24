import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import AppiError from "../utils/ApiError.js";

//after login and registration we can access role :: userPermit("USER")
const userPermit = function (...permitroles) {
  return async function (req, _, next) {
    const user_accesstoken = req.cookies()?.accesstoken;

    if (!user_accesstoken) throw new AppiError(403, "No user signed/logged in");

    const decode_user = jwt.decode(user.accesstoken);
    const user_Role = await userModel
      .findOne(decode_user.name)
      .select("-name -password -phone -email -refreshtoken -_id");

    if (permitroles.includes(user_Role.role)) {
      next();
    } else {
      throw new AppiError(403, "No role assigned");
    }
  };
};

export default userPermit;
