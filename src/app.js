import express from "express";
import ingestParquetFiles from "./ingestion/ingest.js";
import runTransformOnParquet from "./transformation/transform.js";
import runValidationReport from "./validation/validate.js";
import saveToWarehouse from "./storage/saveToWarehouse.js";

import apiRoutes from "./routes/index.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("🌱 Agri Data Pipeline is running");
});

app.use("/api", apiRoutes);

app.listen(PORT, async () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  await ingestParquetFiles();
  await runTransformOnParquet();

  await runValidationReport();
  await saveToWarehouse();
});
