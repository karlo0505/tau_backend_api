import express from "express";
import { createValidator } from "express-joi-validation";
const validator = createValidator();
const router = express.Router();

import {
  adminLoginAction,
  changePassword,
  createUser,
  forgotPassword,
  loginAction,
  refreshToken,
  resendVericationCode,
  verifyEmail,
  getAllUsers,
  deleteUsers,
  deactivateUser
} from "../controllers/users";
import { getUserInfo } from '../controllers/userInfo'
import {
  changePasswordSchema,
  deleteManySchema,
  emailVerifiedSchema,
  loginUserSchema,
  registerUserSchema,
  resendCodeSchema,
} from "../schema/users";
import { allApplicationSchema, cancelSchema } from "../schema/application";
import verifyToken from "../helpers/verifyToken";

router.route("/").post(validator.body(loginUserSchema), loginAction);
router.route("/register").post(validator.body(registerUserSchema), createUser);
router
  .route("/verifyEmail")
  .post(validator.query(emailVerifiedSchema), verifyEmail);
router
  .route("/resendcode")
  .post(validator.query(resendCodeSchema), resendVericationCode);
router
  .route("/forgotpassword")
  .post(validator.query(resendCodeSchema), forgotPassword);
router
  .route("/changepassword")
  .put(validator.query(changePasswordSchema), changePassword);
router.route("/refreshToken").get(validator.query(allApplicationSchema), verifyToken, refreshToken)
router.route("/getUserInfo").get(validator.query(allApplicationSchema), verifyToken, getUserInfo)
router.route("/adminlogin").post(validator.body(loginUserSchema), adminLoginAction)
router.route("/allusers")
  .get(verifyToken, getAllUsers)
  .post(validator.body(deleteManySchema), deleteUsers)
  .put(validator.query(cancelSchema), deactivateUser)

export default router;
