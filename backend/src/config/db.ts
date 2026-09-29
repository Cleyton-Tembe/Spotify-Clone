import mongoose from "mongoose";
import { config } from "dotenv";

config();

const ConnectDB = async () => {
  try {
    if (!process.env.MONGO_URL)
      return console.log("no url provided to connect");
    const connection = await mongoose.connect(process.env.MONGO_URL);
    console.log("connected to the ", connection.connection.host);
  } catch (error) {
    console.error("connecting to the db: ", error);
    process.exit(1);
  }
};

export default ConnectDB;
