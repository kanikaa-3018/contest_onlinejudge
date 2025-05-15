import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    cfHandle: "",
    lcHandle: "",
    role: "user",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const url = isLogin
      ? "http://localhost:8080/api/users/login"
      : "http://localhost:8080/api/users/register";

    const payload = isLogin
      ? {
          email: formData.email,
          password: formData.password,
          cfHandle: formData.cfHandle,
          lcHandle: formData. lcHandle,
        }
      : {
          name: formData.username,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          cfHandle: formData.cfHandle,
          lcHandle: formData. lcHandle,
          role: formData.role,
        };

    try {
      const res = await axios.post(url, payload);
      const { token, _id, role, cfHandle, lcHandle } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userId", _id);
      localStorage.setItem("user", JSON.stringify(res.data));
      localStorage.setItem("cfHandle", cfHandle || formData.cfHandle);
      localStorage.setItem("role", role);
      localStorage.setItem("lchandle", lcHandle || formData.lcHandle);

      navigate(role === "admin" ? "/admin" : "/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#31304D] to-[#161A30] flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-[#1E1E2E] text-[#F0ECE5] rounded-2xl shadow-xl hover:scale-105 transition-transform duration-300 ease-in-out">
        <CardContent className="p-8 space-y-6">
          <h2 className="text-3xl font-bold text-center mb-4">
            {isLogin ? "Login" : "Register"}
          </h2>

          {error && (
            <p className="text-red-400 text-center text-sm mb-4">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <>
                <Input
                  name="username"
                  placeholder="Username"
                  className="bg-[#31304D] text-[#F0ECE5] focus:ring-2 focus:ring-[#00C8A9] transition-all"
                  value={formData.username}
                  onChange={handleChange}
                />
                <Input
                  name="cfHandle"
                  placeholder="Codeforces Handle"
                  className="bg-[#31304D] text-[#F0ECE5] focus:ring-2 focus:ring-[#00C8A9] transition-all"
                  value={formData.cfHandle}
                  onChange={handleChange}
                />
                <Input
                  name="lcHandle"
                  placeholder="Leetcode Handle"
                  className="bg-[#31304D] text-[#F0ECE5] focus:ring-2 focus:ring-[#00C8A9] transition-all"
                  value={formData.lcHandle}
                  onChange={handleChange}
                />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="bg-[#31304D] text-[#F0ECE5] focus:ring-2 focus:ring-[#00C8A9] p-3 w-full rounded transition-all"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </>
            )}
            <Input
              name="email"
              placeholder="Email"
              type="email"
              className="bg-[#31304D] text-[#F0ECE5] focus:ring-2 focus:ring-[#00C8A9] transition-all"
              value={formData.email}
              onChange={handleChange}
            />
            <Input
              name="password"
              placeholder="Password"
              type="password"
              className="bg-[#31304D] text-[#F0ECE5] focus:ring-2 focus:ring-[#00C8A9] transition-all"
              value={formData.password}
              onChange={handleChange}
            />
            {isLogin && (
              <Input
                name="cfHandle"
                placeholder="Codeforces Handle (for login)"
                className="bg-[#31304D] text-[#F0ECE5] focus:ring-2 focus:ring-[#00C8A9] transition-all"
                value={formData.cfHandle}
                onChange={handleChange}
              />
            )}
            {isLogin && (
              <Input
                name="lcHandle"
                placeholder="Leetcode Handle"
                className="bg-[#31304D] text-[#F0ECE5] focus:ring-2 focus:ring-[#00C8A9] transition-all"
                value={formData.lcHandle}
                onChange={handleChange}
              />
            )}
            <Button
              type="submit"
              className="w-full bg-[#00C8A9] text-[#161A30] hover:bg-[#F0ECE5] hover:text-[#161A30] transition-all p-3 rounded-full"
            >
              {isLogin ? "Login" : "Register"}
            </Button>
          </form>

          <p className="text-center text-sm text-[#B6BBC4] mt-4">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={toggleMode}
              className="text-[#00C8A9] hover:underline"
            >
              {isLogin ? "Register" : "Login"}
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;
