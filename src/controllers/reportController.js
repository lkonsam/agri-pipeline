import path from "path";
import fs from "fs";

const qualityPath = path.resolve("data/processed/data_quality_report.csv");
const gapPath = path.resolve("data/processed/time_gap_report.csv");

export function downloadQualityReport(req, res) {
  if (!fs.existsSync(qualityPath)) {
    return res.status(404).json({ error: "Quality report not found." });
  }

  res.download(qualityPath, "data_quality_report.csv");
}

export function downloadGapReport(req, res) {
  if (!fs.existsSync(gapPath)) {
    return res.status(404).json({ error: "Gap report not found." });
  }

  res.download(gapPath, "time_gap_report.csv");
}
