import express from "express";
import {
  addQuestion,
  getMutipleQuestions,
  getQuestion,
} from "../controllers/questionController.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/add", addQuestion);
router.get("/get/:slug", getQuestion);
router.get("/get", getMutipleQuestions);

export default router;
