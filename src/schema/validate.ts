import { Response, Request, NextFunction } from "express";
import { Params, Query } from "express-serve-static-core";

interface schema {
  body: Request;
  query: Query;
  params: Params;
  validate: Function;
}

export const validate =
  (schema: schema) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (err) {
      return res.status(403).json({ message: " Some errors" });
    }
  };
