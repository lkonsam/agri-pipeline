import express from "express";
import { getAnomalies } from "../controllers/anomalyController.js";

const anomalyRoutes = express.Router();

anomalyRoutes.get("/", getAnomalies);

export default anomalyRoutes;
