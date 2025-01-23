import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Navbar from "./pages/Navbar";
import { useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore";
// import { LoaderCircle } from "lucide-react";
import { ProgressBar } from "react-loader-spinner";
import { Toaster } from "react-hot-toast";
export default function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  if (isCheckingAuth && !authUser)
    return (
      <div className="min-h-screen flex justify-center items-center">
        {/* <LoaderCircle size={50} /> */}
        <ProgressBar
          visible={true}
          height="80"
          width="80"
          color="#4fa94d"
          ariaLabel="progress-bar-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    );
  console.log(authUser);
  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={authUser ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <Signup /> : <Navigate to="/" />}
        />
        <Route
          path="/Login"
          element={!authUser ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/setting"
          element={authUser ? <Settings /> : <Navigate to="/login" />}
        />
        <Route
          path="/profile"
          element={authUser ? <Profile /> : <Navigate to="/login" />}
        />
      </Routes>
      <Toaster />
    </>
  );
}
