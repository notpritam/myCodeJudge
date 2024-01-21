import express from "express";
import passport from "passport";
import { login, register } from "../controllers/authController.js";
const router = express.Router();

router.post("/login", login);
router.post("/register", register);

export default router;
