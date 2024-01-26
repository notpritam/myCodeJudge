import express from "express";
import { addQuestion } from "../controllers/questionController.js";
import { authenticateJWT } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/add", addQuestion);
router.get("/get", (req, res) => {
  console.log("get");
  res
    .json({
      id: "1",
    })
    .status(200);
});

export default router;
