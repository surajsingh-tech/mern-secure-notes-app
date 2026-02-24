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

const schema = yup.object().shape({
  username: yup
    .string()
    .min(3, "Username must be at least 3 characters")
    .required(),
  email: yup.string().email("Invalid email"),
  password: yup
    .string()
    .min(6, "At least 6 characters")
    .matches(/[A-Z]/, "One uppercase required")
    .matches(/[0-9]/, "One number required")
    .matches(/[@$!%*?&#]/, "One special character required")
    .required(),
});

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });

  const getInputData = async (e) => {
    const { name, value } = e.target;
    const trimmedValue = value.trim();
    setFormData((pre) => ({ ...pre, [name]: trimmedValue }));

    try {
      await schema.validateAt(name, { ...formData, [name]: trimmedValue });
      setErrors((prev) => ({ ...prev, [name]: null }));
    } catch (err) {
      setErrors((prev) => ({ ...prev, [name]: [err.message] }));
    }
  };

  const setPostData = async (e) => {
    e.preventDefault();

    const hasErrors = Object.values(errors).some((x) => x && x.length > 0);
    if (hasErrors) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/register",
        formData,
        { headers: { "Content-Type": "application/json" } },
      );
      if (res.data.success) {
        navigate("/verify");
        toast.success(res.data.message);
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        const fieldErrors = {};
        error.response.data.errors.forEach((err) => {
          if (!fieldErrors[err.field]) {
            fieldErrors[err.field] = [];
          }
          fieldErrors[err.field].push(err.message);
        });
        setErrors(fieldErrors);
      }
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold">Create Your Account</h2>
          <p className="text-muted-foreground mt-2">
            Start organizing your thoughts and ideas today
          </p>
        </div>

        <Card className="border shadow-sm">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl text-center">Sign up</CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Create your account to get started with Notes App
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col gap-6">
              {/* Username */}
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  onChange={getInputData}
                  id="username"
                  value={formData.username}
                  type="text"
                  name="username"
                  placeholder="username"
                  required
                  className={`${errors.username ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
                {errors.username && (
                  <p className="text-red-500 text-sm">{errors.username[0]}</p>
                )}
              </div>

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
                  <p className="text-red-500 text-sm"> {errors.email} </p>
                )}
              </div>

              {/* Password */}
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    onChange={getInputData}
                    value={formData.password}
                    id="password"
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
                  <p className="text-red-500 text-sm">{errors.password[0]}</p>
                )}

                {/* Checklist */}
                <ul className="text-sm mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <li
                    className={
                      formData.password.length >= 6
                        ? "text-green-600"
                        : "text-muted-foreground"
                    }
                  >
                    {formData.password.length >= 6 ? "✓" : "•"} At least 6
                    characters
                  </li>
                  <li
                    className={
                      /[A-Z]/.test(formData.password)
                        ? "text-green-600"
                        : "text-muted-foreground"
                    }
                  >
                    {/[A-Z]/.test(formData.password) ? "✓" : "•"} One uppercase
                    letter
                  </li>
                  <li
                    className={
                      /[0-9]/.test(formData.password)
                        ? "text-green-600"
                        : "text-muted-foreground"
                    }
                  >
                    {/[0-9]/.test(formData.password) ? "✓" : "•"} One number
                  </li>
                  <li
                    className={
                      /[@$!%*?&#]/.test(formData.password)
                        ? "text-green-600"
                        : "text-muted-foreground"
                    }
                  >
                    {/[@$!%*?&#]/.test(formData.password) ? "✓" : "•"} One
                    special character
                  </li>
                </ul>
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
                  Creating account...
                </>
              ) : (
                "Signup"
              )}
            </Button>
          </CardFooter>
        </Card>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium underline underline-offset-4 hover:text-foreground"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
