import express from "express";
import { getSummary } from "../../controllers/analyticsController.js";

const summaryRoutes = express.Router();

// GET /api/summary
summaryRoutes.get("/", getSummary);

export default summaryRoutes;
