import dotenv from "dotenv";
dotenv.config();

const port= process.env.PORT || 3000;
const database = process.env.DATABASE || "mongodb://localhost:27017/gortex";
const sessionKeySecret = process.env.SESSION_KEY_SECRET;
export {
    port,
    database,
    sessionKeySecret
}