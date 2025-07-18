import express from "express";

import summaryRoutes from "./summaryRoutes.js";
import anomalyRoutes from "./anomalyRoutes.js";
import reportRoutes from "./reportRoutes.js";

const router = express.Router();

// All API routes grouped under /api
router.use("/summary", summaryRoutes);
router.use("/anomalies", anomalyRoutes);
router.use("/report", reportRoutes);

export default router;
