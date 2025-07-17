import express from "express";
import { getSummary } from "../controllers/analyticsController.js";

const router = express.Router();

// GET /api/summary
router.get("/summary", getSummary);

export default router;
