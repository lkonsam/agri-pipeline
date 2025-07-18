// src/app.js
import express from "express";
import config from "../config/config.js";
import cors from "cors";
import apiRoutes from "./routes/v1/index.js";

// 🔔 Import cron scheduler
import "./scheduler/cron.js";

const app = express();
const PORT = config.port || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("🌱 Agri Data Pipeline is running");
});
app.use("/api/v1", apiRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
