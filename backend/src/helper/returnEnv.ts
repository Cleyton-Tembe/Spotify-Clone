import { config } from "dotenv";

config();
export default function getEnv(): string {
  const MONGO_URL = process.env.MONGO_URL;
  if (!MONGO_URL) throw new Error("Well should checks your env stuff");

  return MONGO_URL;
}
