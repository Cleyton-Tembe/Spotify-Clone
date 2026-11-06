import { create } from "zustand";
import axiosInstance from "../lib/axiosInstance";

type AdminStatus = "unknown" | "checking" | "admin" | "not-admin";

interface AuthStore {
  adminStatus: AdminStatus;
  checkAdmin: () => Promise<void>;
  resetAdmin: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  adminStatus: "unknown",

  checkAdmin: async () => {
    set({ adminStatus: "checking" });
    try {
      await axiosInstance.get("/admin/check");
      set({ adminStatus: "admin" });
    } catch {
      set({ adminStatus: "not-admin" });
    }
  },

  resetAdmin: () => set({ adminStatus: "not-admin" }),
}));
