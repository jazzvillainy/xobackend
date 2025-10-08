import { body } from "express-validator";

export const validationSchema = {
  name: {
    notEmpty: {
      errorMessage: "field cannot be empty",
    },
    errorMessage: "Invalid username",
    // isEmail: true,
  },
  password: {
    notEmpty: true,
    isLength: {
      options: { min: 4 },
      errorMessage: "Password should be at least 8 chars",
    },
  },
};
