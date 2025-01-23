import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigningup: null,
  isLogginging: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,

  checkAuth: async () => {
    try {
      const response = await axiosInstance.get("/auth/check-auth");
      set({ authUser: response.data });
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
  },

  login: async (data) => {
    try {
      set({ isLogginging: true });
      const res = await axiosInstance.post("/auth/signin", data);
      set({ authUser: res.data });
      toast.success("Logged in Sucessfully!");
    } catch (error) {
      console.log("Error is in Login function".error);
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
}));
