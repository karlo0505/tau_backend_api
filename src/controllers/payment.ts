import { ValidatedRequest } from "express-joi-validation";
import { Response } from "express";
import {
  ApprovedPaymentRequestSchema,
  PaymentRequestSchema,
} from "../schema/application";
import { ramdomString } from "../helpers/randomGenerators";
import paypal from "paypal-rest-sdk";
import { Application } from "../models/application";
import { Types } from "mongoose";

paypal.configure({
  mode: `${process.env.PAYPAL_MODE}`, //sandbox or live
  client_id: `${process.env.PAYPAL_CLIENT_ID}`,
  client_secret: `${process.env.PAYPAL_CLIENT_SECRET}`,
});

export const paymentPaypalService = async (
  req: ValidatedRequest<PaymentRequestSchema>,
  res: Response
) => {
  try {
    const { name, price, desc } = req.body;

    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: `${process.env.FRONTEND_URI}/purchase/success`,
        cancel_url: `${process.env.FRONTEND_URI}/purchase/cancel`,
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: name,
                sku: `SKU-${ramdomString(10)}`,
                price: price,
                currency: "USD",
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: "USD",
            total: price,
          },
          description: desc,
        },
      ],
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
        res.status(400).json({ message: error });
      } else {
        res.status(200).json(payment);
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

async function PaymentSuccess(
  res: Response,
  email: string,
  appId: Types.ObjectId
) {
  const application = await Application.findByIdAndUpdate(
    { _id: appId, email },
    { dateOfPayment: Date.now(), appStatus: "approved" }
  );
  if (application) {
    return res.status(200).json({ message: "Successfully paid" });
  }
  return res.status(400).json({ message: "Something wrong in your request" });
}

export const approvedPaypalService = async (
  req: ValidatedRequest<ApprovedPaymentRequestSchema>,
  res: Response
) => {
  try {
    const { payerId, paymentId, total, email, appId } = req.query;

    const execute_payment_json = {
      payer_id: payerId,
      transactions: [
        {
          amount: {
            currency: "USD",
            total: total,
          },
        },
      ],
    };

    paypal.payment.execute(
      paymentId,
      execute_payment_json,
      function async(error, payment) {
        if (error) {
          console.log(error);
          if (error.httpStatusCode === 400) {
            return res
              .status(400)
              .json({ message: "The application has already purchased" });
          }
          return res.status(400).json({ message: error });
        } else {
          if (payment) {
            PaymentSuccess(res, email, appId);
          }
        }
      }
    );
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
