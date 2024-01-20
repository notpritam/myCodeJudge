import express from "express";
import { submitCode } from "../controllers/codeController.js";

const router = express.Router();

router.post("/submit-code", submitCode);

export default router;
