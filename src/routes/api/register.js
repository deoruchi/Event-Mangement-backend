import express from "express";
import refreshTokens from "../../controllers/user.refershTokens.js";
const router = express.Router();
import {
  userRegistration,
  userLogin,
  logOutUser,
} from "../../controllers/user.controllers.js";
import verifyJwt from "../../middleware/verifyJWT.js";
import userPermit from "../../middleware/userRole.js";

//route:register
router.route("/register").post(userRegistration);

//route:login
router.route("/login").post(userLogin);

//route:logout
router.route("/logout").post(verifyJwt, logOutUser);

//route:refresh token

router.route("/refresh").get(refreshTokens);
export default router;
