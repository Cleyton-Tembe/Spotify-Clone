import mongoose from "mongoose";
import { config } from "dotenv";
import getEnv from "../helper/returnEnv.ts";

config();

const ConnectDB = async () => {
  try {
    const connection = await mongoose.connect(getEnv());
    console.log("connected to the ", connection.connection.host);
  } catch (error) {
    console.error("connecting to the db: ", error);
    process.exit(1);
  }
};

export default ConnectDB;
