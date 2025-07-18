import express from "express";
import {
  downloadGapReport,
  downloadQualityReport,
} from "../../controllers/reportController.js";

const reportRoutes = express.Router();

reportRoutes.get("/quality", downloadQualityReport);
reportRoutes.get("/gaps", downloadGapReport);

export default reportRoutes;
