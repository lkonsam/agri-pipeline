import express from "express";
import ingestParquetFiles from "./ingestion/ingest.js";
import runTransformOnParquet from "./transformation/transform.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("🌱 Agri Data Pipeline is running");
});

app.listen(PORT, async () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  await ingestParquetFiles();
  await runTransformOnParquet();
});
