import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:5001";
export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningup: false,
  isLogginging: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  socket: null,
  onlineUsers: [],

  checkAuth: async () => {
    try {
      const response = await axiosInstance.get("/auth/check-auth");
      set({ authUser: response.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },
  signup: async (formData) => {
    try {
      set({ isSigningup: true });
      const res = await axiosInstance.post("/auth/signup", formData);

      set({ authUser: res.data });
      toast.success("Account Created Successfully!");
      get().connectSocket();
    } catch (error) {
      console.log("Error in Signup Function", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningup: false });
    }
  },

  logout: async () => {
    await axiosInstance.post("/auth/logout");
    set({ authUser: null });
    toast.success("Logout Successfully!");
    get().disconnectSocket();
  },

  login: async (data) => {
    try {
      set({ isLogginging: true });
      const res = await axiosInstance.post("/auth/signin", data);
      set({ authUser: res.data });
      toast.success("Logged in Sucessfully!");
      get().connectSocket();
    } catch (error) {
      console.log("Error is in Login function", error);
      toast.error("Invalid Credentials", error.response.data.message);
    } finally {
      set({ isLogginging: false });
    }
  },

  updateProfile: async (data) => {
    try {
      set({ isUpdatingProfile: true });
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Image uploaded Successfully!");
    } catch (error) {
      console.log("Error un updateProfile Function");
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;
    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
        username: authUser.username,
      },
    });
    socket.connect();
    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  disconnectSocket: () => {
    if (get().socket?.connected) {
      get().socket.disconnect();
      set({ socket: null });
    }
  },
}));
