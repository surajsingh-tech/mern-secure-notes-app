import { Alert, AlertDescription } from "@/components/ui/alert";
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
import axios from "axios";
import { CheckCircle, Loader2, RotateCcw } from "lucide-react";
import React, { useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

export default function VerifyOTP() {
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [OTP, setOTP] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef([]);
  const { email } = useParams();
  const navigate = useNavigate();

  const handleInput = (indx, value) => {
    const cleanValue = value.replace(/[^0-9]/g, "").slice(0, 1);
    const updatedOTP = [...OTP];
    updatedOTP[indx] = cleanValue;
    setOTP(updatedOTP);
    if (cleanValue && indx < 5) inputRef.current[indx + 1]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalOtp = OTP.join("");
    if (finalOtp.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }
    try {
      setIsLoading(true);
      const res = await axios.post(
        `http://localhost:8000/api/v1/user/verify-otp/${email}`,
        { otp: finalOtp },
      );
      if (res.data.success) {
        setIsVerified(true);
        setSuccessMessage(res.data.message);
        setOTP(["", "", "", "", "", ""]);
      }
      setTimeout(() => navigate(`/change-password/${email}`), 2000);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const clearOTP = () => {
    setOTP(["", "", "", "", "", ""]);
    setError("");
    inputRef.current[0]?.focus();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl">
        <Card className="rounded-3xl shadow-lg p-6 sm:p-10 bg-white border">
          {/* Header */}
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-foreground">
              Verify Your Email
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground text-sm sm:text-base">
              {isVerified
                ? "Code Verified Successfully! Redirecting..."
                : `Enter the 6-digit code sent to ${email}`}
            </CardDescription>
          </CardHeader>

          {/* Content */}
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive" className="text-center">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {successMessage && (
              <p className="text-green-600 text-center font-medium">
                {successMessage}
              </p>
            )}

            {isVerified ? (
              <div className="flex flex-col items-center justify-center space-y-4 py-6">
                <div className="bg-green-100 p-4 rounded-full">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <div className="space-y-2 text-center">
                  <h3 className="font-semibold text-lg sm:text-xl">
                    Verification Successful
                  </h3>
                  <p className="text-gray-500 text-sm sm:text-base">
                    Your email has been verified. You'll be redirected to reset
                    your password.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-5 w-5 animate-spin text-gray-500" />
                  <span className="text-gray-500 text-sm">Redirecting...</span>
                </div>
              </div>
            ) : (
              <>
                {/* OTP Inputs */}
                <div className="flex justify-between space-x-2 mb-6">
                  {OTP.map((digit, indx) => (
                    <Input
                      key={indx}
                      value={digit}
                      type="text"
                      maxLength={1}
                      ref={(el) => (inputRef.current[indx] = el)}
                      onChange={(e) => handleInput(indx, e.target.value)}
                      className="w-14 h-14 sm:w-16 sm:h-16 text-center text-xl sm:text-2xl font-bold rounded-xl shadow-sm border transition focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={handleSubmit}
                    disabled={isLoading || OTP.some((digit) => digit === "")}
                    className="w-full bg-primary hover:bg-primary/90 text-white"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                        Verifying...
                      </>
                    ) : (
                      "Verify Code"
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={clearOTP}
                    disabled={isLoading || isVerified}
                    className="w-full"
                  >
                    <RotateCcw className="mr-2 h-4 w-4" /> Clear
                  </Button>
                </div>
              </>
            )}
          </CardContent>

          {/* Footer */}
          <CardFooter className="flex justify-center space-x-2">
            <p className="text-sm text-muted-foreground">Wrong email?</p>
            <Link
              to={"/forgot-password"}
              className="text-primary hover:underline font-medium"
            >
              Go back
            </Link>
          </CardFooter>

          {/* Testing Hint */}
          <div className="text-center text-xs text-muted-foreground mt-4">
            <p>
              For testing purposes, use code:{" "}
              <span className="font-mono font-medium">123456</span>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
