import type { Server as HttpServer } from "node:http";
import { Server } from "socket.io";
import { verifyToken } from "@clerk/backend";
import { Message } from "../model/message.ts";

const CLIENT_URL = "http://localhost:5173";

// What a user is listening to; null = idle
type Activity = { title: string; artist: string } | null;

const connectionCount = new Map<string, number>();
const userActivities = new Map<string, Activity>();

const toActivity = (value: unknown): Activity => {
  if (!value || typeof value !== "object") return null;
  const { title, artist } = value as Record<string, unknown>;
  if (typeof title !== "string" || typeof artist !== "string") return null;
  return { title: title.slice(0, 200), artist: artist.slice(0, 200) };
};

export const initializeSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: { origin: CLIENT_URL, credentials: true },
  });

  io.use(async (socket, next) => {
    try {
      const token: unknown = socket.handshake.auth?.token;
      if (typeof token !== "string" || !token)
        return next(new Error("Unauthorized"));

      const payload = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY!,
        authorizedParties: [CLIENT_URL],
      });

      socket.data.userId = payload.sub;
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    const userId: string = socket.data.userId;

    // One room per user
    socket.join(userId);

    const count = (connectionCount.get(userId) ?? 0) + 1;
    connectionCount.set(userId, count);
    if (!userActivities.has(userId)) userActivities.set(userId, null);

    // Send the current state to the newly connected tab
    socket.emit("users_online", [...connectionCount.keys()]);
    socket.emit("activities", [...userActivities.entries()]);

    if (count === 1) socket.broadcast.emit("user_connected", userId);

    socket.on("update_activity", (value: unknown) => {
      const activity = toActivity(value);
      userActivities.set(userId, activity);
      io.emit("activity_updated", { userId, activity });
    });

    socket.on("send_message", async (data: unknown) => {
      try {
        const { receiverId, content } = (data ?? {}) as Record<string, unknown>;
        if (typeof receiverId !== "string" || typeof content !== "string")
          return;

        const text = content.trim().slice(0, 2000);
        if (!text) return;

        const message = await Message.create({
          senderId: userId,
          receiverId,
          content: text,
        });

        io.to(receiverId).emit("receive_message", message); // receiver, all tabs
        io.to(userId).emit("message_sent", message); // sender, all tabs
      } catch (error) {
        console.log("Error sending message", error);
        socket.emit("message_error", "Couldn't send the message");
      }
    });

    socket.on("disconnect", () => {
      const remaining = (connectionCount.get(userId) ?? 1) - 1;

      if (remaining > 0) {
        connectionCount.set(userId, remaining);
        return;
      }

      // Last tab closed: the user is offline
      connectionCount.delete(userId);
      userActivities.delete(userId);
      io.emit("user_disconnected", userId);
    });
  });

  return io;
};
