import express from "express";
import { callback, logout } from "../controllers/authController.js";
const router = express.Router();

router.post("/google/callback", callback);

router.get("/logout", logout);

export default router;
