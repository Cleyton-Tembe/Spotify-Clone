import { create } from "zustand";
import { io, type Socket } from "socket.io-client";
import { getToken } from "@clerk/react";
import axiosInstance from "../lib/axiosInstance";
import type { Message, User } from "../types";

const SOCKET_URL = import.meta.env.DEV ? "http://localhost:4000" : "/";

export type Activity = { title: string; artist: string } | null;

interface ChatStore {
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: Set<string>;
  userActivities: Map<string, Activity>;
  myActivity: Activity;

  users: User[];
  isLoadingUsers: boolean;

  selectedUser: User | null;
  messages: Message[];
  isLoadingMessages: boolean;

  connectSocket: () => void;
  disconnectSocket: () => void;
  updateActivity: (activity: Activity) => void;
  fetchUsers: () => Promise<void>;
  setSelectedUser: (user: User | null) => void;
  sendMessage: (receiverId: string, content: string) => void;
}

const addMessage = (messages: Message[], message: Message) =>
  messages.some((m) => m._id === message._id)
    ? messages
    : [...messages, message];

export const useChatStore = create<ChatStore>((set, get) => ({
  socket: null,
  isConnected: false,
  onlineUsers: new Set(),
  userActivities: new Map(),
  myActivity: null,

  users: [],
  isLoadingUsers: false,

  selectedUser: null,
  messages: [],
  isLoadingMessages: false,

  connectSocket: () => {
    if (get().socket) return; // already connected

    const socket = io(SOCKET_URL, {
      withCredentials: true,
      // A function, so every (re)connect sends a fresh Clerk token
      auth: (cb) => {
        getToken()
          .then((token) => cb({ token }))
          .catch(() => cb({ token: null }));
      },
    });

    socket.on("connect", () => {
      set({ isConnected: true });
      socket.emit("update_activity", get().myActivity); // re-announce after a reconnect
    });
    socket.on("disconnect", () => set({ isConnected: false }));
    socket.on("connect_error", (err) =>
      console.log("Socket connection error:", err.message),
    );

    socket.on("users_online", (ids: string[]) =>
      set({ onlineUsers: new Set(ids) }),
    );

    socket.on("activities", (entries: [string, Activity][]) =>
      set({ userActivities: new Map(entries) }),
    );

    socket.on("user_connected", (userId: string) =>
      set((s) => ({ onlineUsers: new Set(s.onlineUsers).add(userId) })),
    );

    socket.on("user_disconnected", (userId: string) =>
      set((s) => {
        const onlineUsers = new Set(s.onlineUsers);
        onlineUsers.delete(userId);
        const userActivities = new Map(s.userActivities);
        userActivities.delete(userId);
        return { onlineUsers, userActivities };
      }),
    );

    socket.on(
      "activity_updated",
      ({ userId, activity }: { userId: string; activity: Activity }) =>
        set((s) => ({
          userActivities: new Map(s.userActivities).set(userId, activity),
        })),
    );

    socket.on("receive_message", (message: Message) => {
      if (get().selectedUser?.clerkId === message.senderId) {
        set((s) => ({ messages: addMessage(s.messages, message) }));
      }
    });

    socket.on("message_sent", (message: Message) => {
      if (get().selectedUser?.clerkId === message.receiverId) {
        set((s) => ({ messages: addMessage(s.messages, message) }));
      }
    });

    socket.on("message_error", (msg: string) => console.log(msg));

    set({ socket });
  },

  disconnectSocket: () => {
    get().socket?.disconnect();
    set({
      socket: null,
      isConnected: false,
      onlineUsers: new Set(),
      userActivities: new Map(),
    });
  },

  updateActivity: (activity) => {
    set({ myActivity: activity });
    const { socket } = get();
    if (socket?.connected) socket.emit("update_activity", activity);
  },

  fetchUsers: async () => {
    set({ isLoadingUsers: true });
    try {
      const res = await axiosInstance.get<User[]>("/users");
      set({ users: res.data });
    } catch (error) {
      console.log("Error fetching users", error);
    } finally {
      set({ isLoadingUsers: false });
    }
  },

  setSelectedUser: async (user) => {
    set({ selectedUser: user, messages: [], isLoadingMessages: !!user });
    if (!user) return;

    try {
      const res = await axiosInstance.get<Message[]>(
        `/users/messages/${user.clerkId}`,
      );

      if (get().selectedUser?.clerkId !== user.clerkId) return;

      set((s) => ({ messages: s.messages.reduce(addMessage, res.data) }));
    } catch (error) {
      console.log("Error fetching messages", error);
    } finally {
      if (get().selectedUser?.clerkId === user.clerkId)
        set({ isLoadingMessages: false });
    }
  },

  sendMessage: (receiverId, content) => {
    const text = content.trim();
    const { socket } = get();
    if (!text || !socket?.connected) return;
    socket.emit("send_message", { receiverId, content: text });
  },
}));
