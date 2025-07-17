import dotenv from "dotenv";
// import fs from "fs";
// import path from "path";

// const envPath = path.join(__dirname, "../.env");
// console.log("Looking for .env at:", envPath);
// console.log("File exists:", fs.existsSync(envPath)); // should be true
// dotenv.config({ path: envPath });
// console.log("Loaded MONGODB_URL:", process.env.MONGODB_URL); // should show the URL

dotenv.config(); //by default root folder

const config = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
};

export default config;
