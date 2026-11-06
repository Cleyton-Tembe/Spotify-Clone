import express, { type Request, type Response } from "express";
import { createServer } from "http";
import { initializeSocket } from "./config/socket.ts";
import ConnectDB from "./config/db.ts";
import { config } from "dotenv";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import fileUpload from "express-fileupload";
import path from "node:path";
import cron from "node-cron";
import fs from "node:fs";
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

const httpServer = createServer(app);
initializeSocket(httpServer);

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

const tempDir = path.join(process.cwd(), "tmp");
cron.schedule("0 * * * *", () => {
  if (fs.existsSync(tempDir)) {
    fs.readdir(tempDir, (err, files) => {
      if (err) {
        console.log("error", err);
        return;
      }
      for (const file of files) {
        fs.unlink(path.join(tempDir, file), (err) => {});
      }
    });
  }
});
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ message: "hello" });
});

app.use("/api/admin", adminRouter);
app.use("/api/auth", authRouter);
app.use("/api/stats", statsRouter);

app.use("/api/users", userRouter);

app.use("/api/albums", albumRouter);
app.use("/api/songs", songRouter);

const frontendDist = path.join(import.meta.dirname, "../../frontend/dist");
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));

  app.use((req: Request, res: Response, next) => {
    if (req.method !== "GET" || req.path.startsWith("/api")) return next();
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

httpServer.listen(port, () => {
  console.log("server started at: ", port);
  ConnectDB();
});
