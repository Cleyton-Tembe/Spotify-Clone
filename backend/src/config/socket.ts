import { Server } from "socket.io";
import { Message } from "../model/message.ts";
import type { Server as HttpServer } from "node:http";
import type { IMessage } from "../interface/Imodel.ts";

interface UpdateActivityData {
  userId: string;
  activity: string;
}

interface SendMessageData {
  senderId: string;
  receiverId: string;
  content: string;
}

interface ServerToClientEvents {
  user_connected: (userId: string) => void;

  users_online: (userIds: string[]) => void;

  activities: (activities: [string, string][]) => void;

  activity_updated: (data: UpdateActivityData) => void;

  receive_message: (message: IMessage) => void;

  message_sent: (message: IMessage) => void;

  message_error: (error: string) => void;

  user_disconnected: (userId: string) => void;
}

interface ClientToServerEvents {
  user_connected: (userId: string) => void;

  update_activity: (data: UpdateActivityData) => void;

  send_message: (data: SendMessageData) => void;
}

export const initializeSocket = (
  server: HttpServer,
): Server<ClientToServerEvents, ServerToClientEvents> => {
  const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: true,
    },
  });

  // userId -> socketId
  const userSockets = new Map<string, string>();

  // userId -> activity
  const userActivities = new Map<string, string>();

  io.on("connection", (socket) => {
    socket.on("user_connected", (userId) => {
      userSockets.set(userId, socket.id);
      userActivities.set(userId, "Idle");

      // Notify everyone that this user is online
      io.emit("user_connected", userId);

      // Send current online users to this client
      socket.emit("users_online", Array.from(userSockets.keys()));

      // Send current activities
      io.emit("activities", Array.from(userActivities.entries()));
    });

    socket.on("update_activity", ({ userId, activity }) => {
      console.log("Activity updated:", userId, activity);

      userActivities.set(userId, activity);

      io.emit("activity_updated", {
        userId,
        activity,
      });
    });

    socket.on("send_message", async ({ senderId, receiverId, content }) => {
      try {
        const message = await Message.create({
          senderId,
          receiverId,
          content,
        });

        // Send message to receiver if online
        const receiverSocketId = userSockets.get(receiverId);

        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receive_message", message);
        }

        // Confirm message to sender
        socket.emit("message_sent", message);
      } catch (error: unknown) {
        console.error("Message error:", error);

        const errorMessage =
          error instanceof Error ? error.message : "Failed to send message";

        socket.emit("message_error", errorMessage);
      }
    });

    socket.on("disconnect", () => {
      let disconnectedUserId: string | undefined;

      for (const [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          disconnectedUserId = userId;

          userSockets.delete(userId);
          userActivities.delete(userId);

          break;
        }
      }

      if (disconnectedUserId) {
        io.emit("user_disconnected", disconnectedUserId);
      }
    });
  });

  return io;
};
