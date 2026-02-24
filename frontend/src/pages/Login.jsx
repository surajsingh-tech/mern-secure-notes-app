import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import * as yup from "yup";
import { getData } from "@/context/userContext";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("email Field is Require"),
  password: yup.string().required("Password Field is Require"),
});

export default function Login() {
  const { setUser } = getData();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  console.log("Form errors", errors);

  const [formData, setFormData] = useState({
    password: "",
    email: "",
  });

  const getInputData = async (e) => {
    const { name, value } = e.target;
    const trimedValue = value.trim();
    setFormData((pre) => ({ ...pre, [name]: trimedValue }));
    try {
      await schema.validateAt(name, { ...formData, [name]: trimedValue });
      setErrors((prev) => ({ ...prev, [name]: "" }));
    } catch (err) {
      setErrors((prev) => ({ ...prev, [name]: err.message }));
    }
  };

  const setPostData = async (e) => {
    e.preventDefault();

    try {
      await schema.validate(formData, { abortEarly: false });
      setErrors({});
    } catch (error) {
      const formError = {};
      error?.inner?.forEach((err) => {
        formError[err.path] = err.message;
      });
      setErrors(formError);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/login",
        formData,
        { headers: { "Content-Type": "application/json" } },
      );
      if (res.data.success) {
        navigate("/");
        setUser(res.data.user);
        localStorage.setItem("accessToken", res.data?.accessToken);
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold">Welcome Back</h2>
          <p className="text-muted-foreground mt-2">
            Login to continue managing your notes securely
          </p>
        </div>

        <Card className="border shadow-sm">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl text-center">
              Login into Your Account
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Login your account to get started with Notes App
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col gap-6">
              {/* Email */}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  onChange={getInputData}
                  value={formData.email}
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  name="email"
                  required
                  className={`${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div className="grid gap-2">
                <div className="flex">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="/forgot-password"
                    className="ml-auto text-sm underline underline-offset-4 hover:text-foreground"
                  >
                    Forgot your password?
                  </Link>
                </div>

                <div className="relative">
                  <Input
                    onChange={getInputData}
                    value={formData.password}
                    id="password"
                    placeholder="Enter Password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    className={`${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                  />
                  <Button
                    size="sm"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    variant="ghost"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>

                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password}</p>
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex-col gap-3">
            <Button
              type="button"
              disabled={isLoading}
              className="w-full"
              onClick={setPostData}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </CardFooter>
        </Card>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Create an account?{" "}
          <Link
            to="/signup"
            className="font-medium underline underline-offset-4 hover:text-foreground"
          >
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
}
