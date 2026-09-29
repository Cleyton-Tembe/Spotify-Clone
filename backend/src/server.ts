import express, { type Request, type Response } from "express";
import ConnectDB from "./config/db.ts";
import { config } from "dotenv";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import fileUpload from "express-fileupload";
import path from "node:path";
import adminRouter from "./routes/admin.ts";
import userRouter from "./routes/user.ts";
import statsRouter from "./routes/stats.ts";
import albumRouter from "./routes/album.ts";
import songRouter from "./routes/song.ts";
import authRouter from "./routes/auth.ts";

config();

const port = process.env.PORT || 4000;
const __dirname = path.resolve();
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(clerkMiddleware());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(__dirname, "temp"),
    createParentPath: true,
    limits: {
      fileSize: 10 * 1024 * 1024,
    },
  }),
);
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "hello" });
});

app.use("/api/admin", adminRouter);
app.use("/api/auth", authRouter);
app.use("/api/stats", statsRouter);

app.use("/api/users", userRouter);

app.use("/api/albums", albumRouter);
app.use("/api/songs", songRouter);

app.listen(port, () => {
  console.log("server started at: ", port);
  ConnectDB();
});
