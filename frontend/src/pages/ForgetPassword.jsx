import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CheckCircle, Loader2, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import axios from "axios";
import { toast } from "sonner";

export default function ForgotPassword() {
  const [isloading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [isSubmited, setSubmited] = useState(false);

  const schema = yup.object({
    email: yup.string().email().required("email field is maindatory"),
  });

  const checkInput = async (e) => {
    try {
      let { name, value } = e.target;
      const trimedValue = value.trim();
      setEmail(trimedValue);
      await schema.validateAt("email", { [name]: trimedValue });
      setError("");
    } catch (error) {
      setError(error?.message);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      await schema.validate({ email });
      setError("");
    } catch (err) {
      setError(err.message);
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/forget-password",
        { email },
      );
      if (res.data.success) {
        toast.success(res.data?.message);
        navigate(`/verify-otp/${email}`);
        toast.success(res.data.message);
        setEmail("");
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
        {/* Page Heading */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">Reset Your Password</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Enter your email to receive instructions to reset your password
          </p>
        </div>

        {/* Card */}
        <Card className="border rounded-2xl shadow-sm">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl text-center">
              Forgot Password
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              {isSubmited
                ? "Check your email for reset instructions"
                : "Enter your email address to receive a password reset link"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {isSubmited ? (
              // ✅ After submitting
              <div className="py-6 flex flex-col items-center justify-center text-center space-y-4">
                <div className="bg-primary/10 rounded-full p-3">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-lg">Check your inbox</h3>
                  <p className="text-muted-foreground">
                    We've sent a password reset link to{" "}
                    <span className="font-medium text-foreground">{email}</span>
                  </p>
                  <p>
                    If you don't see the email, check your spam folder or{" "}
                    <button
                      className="text-primary hover:underline font-medium"
                      onClick={() => setSubmited(false)}
                    >
                      try again
                    </button>
                  </p>
                </div>
              </div>
            ) : (
              // ✅ Before submitting
              <form className="space-y-4" onSubmit={handleForgotPassword}>
                <div className="space-y-2 relative">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    name="email"
                    value={email}
                    onChange={checkInput}
                    disabled={isloading}
                  />
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                </div>
                <Button type="submit" className="w-full" disabled={isloading}>
                  {isloading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Sending reset link...
                    </>
                  ) : (
                    "Send reset link"
                  )}
                </Button>
              </form>
            )}
          </CardContent>

          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Remember your password?{" "}
              <Link
                to="/login"
                className="text-primary hover:underline font-medium"
              >
                Login
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
