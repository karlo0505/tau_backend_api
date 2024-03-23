import express from "express";
import { createValidator } from "express-joi-validation";
const validator = createValidator();
const router = express.Router();

import {
    createuserinfo, getUserInfo
} from "../controllers/userInfo";
import { userInfoSchema } from "../schema/userInfo";
import { allApplicationSchema } from "../schema/application";
import verifyToken from "../helpers/verifyToken";

router.route("/").post(validator.body(userInfoSchema), createuserinfo).get(validator.query(allApplicationSchema), verifyToken, getUserInfo)

export default router;
