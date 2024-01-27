import express from "express";
import { submitCode } from "../controllers/codeController.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/submit-code/:slug", submitCode);

export default router;
