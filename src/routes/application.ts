import express from "express";
import { createValidator } from "express-joi-validation";
const validator = createValidator();
const router = express.Router();

import {
  userApplication,
  cancelApplication,
  createApplication,
  allApplication,
  deleteApplication,
  singleApp,
  updateSingleApp,
  getOneApplication,
  appIdSingleApp,
} from "../controllers/applications";
import {
  applicationSchema,
  allApplicationSchema,
  cancelSchema,
  singleAppSchema,
  PaymentSchema,
  GetOneAppSchema,
  ApprovedPaymentSchema,
  UserSingleAppSchema,
} from "../schema/application";
import verifyToken from "../helpers/verifyToken";
import { deleteManySchema } from "../schema/users";
import {
  approvedPaypalService,
  paymentPaypalService,
} from "../controllers/payment";

router
  .route("/")
  .post(validator.body(applicationSchema), createApplication)
  .get(validator.query(allApplicationSchema), verifyToken, userApplication);
router
  .route("/update/app")
  .put(validator.query(cancelSchema), verifyToken, cancelApplication);
router.route("/all/data").get(verifyToken, allApplication);
router
  .route("/singleapplication")
  .get(validator.query(singleAppSchema), verifyToken, singleApp)
  .put(validator.query(singleAppSchema), verifyToken, updateSingleApp)
  .post(validator.body(deleteManySchema), deleteApplication);
router
  .route("/applicationpayment")
  .post(validator.body(PaymentSchema), verifyToken, paymentPaypalService);
router
  .route("/getsingleapp")
  .get(validator.query(GetOneAppSchema), verifyToken, getOneApplication);
router
  .route("/executepayment")
  .post(
    validator.query(ApprovedPaymentSchema),
    verifyToken,
    approvedPaypalService
  );
router
  .route("/appIdSingleApp")
  .get(validator.query(UserSingleAppSchema), verifyToken, appIdSingleApp);

export default router;
