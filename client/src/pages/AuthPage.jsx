import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { toast } from "react-toastify";

const AuthPage = () => {
  const navigate = useNavigate();

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const { credential } = credentialResponse;
      const decoded = jwt_decode(credential); // you can log to see what's inside

      // send token to your backend for verification
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/google-login`, {
        token: credential,
      });

      const { token, _id, role, cfHandle, lcHandle } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userId", _id);
      localStorage.setItem("user", JSON.stringify(res.data));
      localStorage.setItem("cfHandle", cfHandle || "");
      localStorage.setItem("lcHandle", lcHandle || "");
      localStorage.setItem("role", role);

      window.dispatchEvent(new Event("userStatusChanged"));
      toast.success("Google login successful!");
      navigate(role === "admin" ? "/admin" : "/");
    } catch (err) {
      toast.error("Google authentication failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#31304D] to-[#161A30] flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-[#1E1E2E] text-[#F0ECE5] rounded-2xl shadow-xl hover:scale-105 transition-transform duration-300 ease-in-out">
        <CardContent className="p-8 space-y-6">
          <h2 className="text-3xl font-bold text-center mb-6">Welcome</h2>
          <p className="text-center text-sm text-[#B6BBC4] mb-4">
            Login or Register using your Google account
          </p>
          <div className="flex justify-center">
            <GoogleLogin onSuccess={handleGoogleLoginSuccess} onError={() => toast.error("Login Failed")} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
