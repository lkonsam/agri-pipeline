import dotenv from "dotenv";

dotenv.config(); //by default root folder

const config = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
};

export default config;
