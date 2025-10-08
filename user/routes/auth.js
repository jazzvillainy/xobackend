import express, { Router } from "express";
import { validationSchema } from "../../utils/validationSchema.js";
import passport from "passport";
import  jwt  from "jsonwebtoken";
import cookieParser from "cookie-parser";
import {
  ExpressValidator,
  query,
  checkSchema,
  param,
  validationResult,
  body,
} from "express-validator";
import "../../strategy/localStrategy.js";

const router = Router();

router.get("/login", (req, res) => {
  //   const result = validationResult(req);

  res.status(200).send("<>enter name and password</>");
});

router.post(
  "/login",
  checkSchema(validationSchema),
  (x, y, next) => {
    console.log("first step");
    next();
  },
  passport.authenticate("local"),
  (req, res) => {
    console.log("second step");

    console.log(validationResult(req));
    return res.status(200).send("<>item</>");
  }
);

export default router;
