import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Verify() {
  const { token } = useParams();
  const [status, setStatus] = useState("Verifying...");
  const navigate = useNavigate();

  const verifyEmail = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/user/verify",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (res.data.success) {
        setStatus("✅ Email Verified Successfully");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setStatus("❌ Invalid or Expired Token");
      }
    } catch (error) {
      console.log(error);
      setStatus("❌ Verification Failed, Please try again");
    }
  };

  useEffect(() => {
    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold">Email Verification</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Please wait while we verify your email
          </p>
        </div>

        <Card className="border rounded-2xl shadow-sm">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl text-center text-primary">
              Verification Status
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
              {status}
            </h2>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
