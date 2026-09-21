import { create } from "zustand";
import apiRequest from "./apiRequest";

export const useNotificationStore = create((set) => ({
  number: 0,
  fetch: async () => {
    try {
      const res = await apiRequest("/users/notification");
      // The API returns `{ number: <int> }`.
      set({ number: res.data.number ?? 0 });
    } catch {
      set({ number: 0 });
    }
  },
  decrease: () => {
    set((prev) => ({ number: Math.max(prev.number - 1, 0) }));
  },
  reset: () => {
    set({ number: 0 });
  },
}));
