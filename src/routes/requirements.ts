import express from "express";
import { createValidator } from "express-joi-validation";
const validator = createValidator();
const router = express.Router();

import {
    addNewOneRequirements,
    createRequirements,
    deleteOneRequirements,
    getRequirements
} from "../controllers/requirements";
import { requirementSchema } from "../schema/requirements";
import { allApplicationSchema, deleteRequirementSchema, updateRequirementSchema } from "../schema/application";
import verifyToken from "../helpers/verifyToken";

router.route("/")
    .post(validator.body(requirementSchema), createRequirements)
    .get(validator.query(allApplicationSchema), verifyToken, getRequirements)
    .delete(validator.query(deleteRequirementSchema), verifyToken, deleteOneRequirements)
    .put(validator.body(updateRequirementSchema), verifyToken, addNewOneRequirements)

export default router;
