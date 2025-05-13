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
        }
      : {
          name: formData.username,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          cfHandle: formData.cfHandle,
        };

    try {
      const res = await axios.post(url, payload);
      const { token, _id } = res.data;

  
      localStorage.setItem("token", token);
      localStorage.setItem("userId", _id);
      localStorage.setItem("user", JSON.stringify(res.data)); 
      localStorage.setItem("cfHandle", formData.cfHandle || res.data.cfHandle);

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-[#161A30] flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-[#1E1E2E] text-[#F0ECE5] rounded-2xl shadow-xl">
        <CardContent className="p-6 space-y-6">
          <h2 className="text-2xl font-bold text-center">
            {isLogin ? "Login" : "Register"}
          </h2>

          {error && <p className="text-red-400 text-center text-sm">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <Input
                  name="username"
                  placeholder="Username"
                  className="bg-[#31304D] text-[#F0ECE5]"
                  value={formData.username}
                  onChange={handleChange}
                />
                <Input
                  name="cfHandle"
                  placeholder="Codeforces Handle"
                  className="bg-[#31304D] text-[#F0ECE5]"
                  value={formData.cfHandle}
                  onChange={handleChange}
                />
              </>
            )}
            <Input
              name="email"
              placeholder="Email"
              type="email"
              className="bg-[#31304D] text-[#F0ECE5]"
              value={formData.email}
              onChange={handleChange}
            />
            <Input
              name="password"
              placeholder="Password"
              type="password"
              className="bg-[#31304D] text-[#F0ECE5]"
              value={formData.password}
              onChange={handleChange}
            />
            <Button
              type="submit"
              className="w-full bg-[#31304D] text-[#F0ECE5] hover:bg-[#F0ECE5] hover:text-[#161A30] transition-all"
            >
              {isLogin ? "Login" : "Register"}
            </Button>
          </form>

          <p className="text-center text-sm text-[#B6BBC4]">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={toggleMode}
              className="text-blue-400 hover:underline"
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
