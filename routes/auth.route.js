import express from "express";
import { upload } from "../middlewares/upload.js";
import { createAccount, login,createProfessionalWithService } from "../controllers/auth.controller.js";
import {
  loginValidation,
  registerValidations,
} from "../validations/authvalidations.js";
import validate from "../middlewares/validate.js";


const router = express.Router();

router.post(
  "/register",
  // upload.single("profilePicture"),
  registerValidations,
  validate,
  createAccount,
);
router.post(
  "/register-profetionals",

  registerValidations,
  validate,
  createProfessionalWithService,
);

router.post("/login", loginValidation, validate, login);

export const authRouter = router;
