import { Schema, mongoose } from "mongoose";
import bcrypt from "bcrypt";
import {
  validate_password,
  validate_password_strength,
} from "../controllers/authsHelpers/passwordValidation.js";
import jwt from "jsonwebtoken";

//user registration model/schema
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      match: /^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/,
    },
    password: {
      type: String,
      password: [true, "password is required"],
    },
    role: {
      type: String,
      enum: ["admin", "organiser", "attendee"],
    },
    refreshtoken: {
      type: String,
    },
  },
  { timestamps: true }
);

// hash password
userSchema.pre("save", async function (next) {
  let user = this; // current schema
  if (user.isModified("password")) {
    if (!validate_password(user.password))
      return next(new Error("Password must be of length more than 8"));

    if (!validate_password_strength(user.password)) {
      return next(
        new Error(
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
        )
      );
    }

    try {
      user.password = await bcrypt.hash(user.password, 10);
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

//NOte"  the method created is accesable only by the user :: don't access using the model.

//compare the password
userSchema.methods.compare_password = function (password) {
  return bcrypt.compareSync(password, this.password); //compare the passwords
};

//Access key
userSchema.methods.generateAccessToken = function () {
  const access_token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_KEY,
    { expiresIn: process.env.ACCESS_TOKEN_EXP_TIME }
  );
  return access_token;
};

//Refresh Token
userSchema.methods.generateRefreshToken = function () {
  const refresh_token = jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_KEY,
    { expiresIn: process.env.REFRESH_TOKEN_EXP_DATE }
  );

  return refresh_token;
};

const userModel = new mongoose.model("userscheme", userSchema);
export default userModel;
