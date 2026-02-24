import { Button } from "@/components/ui/button";
import axios from "axios";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ChangePassword() {
  const { email } = useParams();
  const [error, setError] = useState({});
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [showNewPass, setshowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const schema = yup.object({
    newPassword: yup
      .string()
      .min(6, "At least 6 characters")
      .matches(/[A-Z]/, "One uppercase required")
      .matches(/[0-9]/, "One number required")
      .matches(/[@$!%*?&#]/, "One special character required")
      .required("field is required"),
    confirmPassword: yup.string().required("field is required"),
  });

  const [userPass, setUserPass] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const handleUserInputPass = async (e) => {
    let { name, value } = e.target;
    let trimValue = value.trim();
    setUserPass((pre) => ({
      ...pre,
      [name]: trimValue,
    }));
    try {
      await schema.validateAt(name, { ...userPass, [name]: trimValue });
      setError((err) => ({ ...err, [name]: "" }));
    } catch (error) {
      setError((err) => ({ ...err, [name]: [error.message] }));
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    try {
      await schema.validate(userPass, { abortEarly: false });
      setError({});
    } catch (error) {
      const passwordError = {};
      error?.inner?.forEach((err) => {
        passwordError[err.path] = err.message;
      });
      setError(passwordError);
      return;
    }

    setError({});
    setSuccess("");

    if (userPass.newPassword !== userPass.confirmPassword) {
      setError({ confirmPassword: "Passwords do not match" });
      return;
    }
    try {
      setIsLoading(true);
      const res = await axios.post(
        `http://localhost:8000/api/v1/user/change-password/${email}`,
        {
          newPassword: userPass.newPassword,
          confirmPassword: userPass.confirmPassword,
        },
      );

      if (res.data.success) {
        setUserPass({
          newPassword: "",
          confirmPassword: "",
        });
        setSuccess(res.data.message);
        toast.success(res.data.message);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      setError({
        serverError: error.response?.data?.message || "Somthing went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="bg-white rounded-2xl border shadow-sm p-6 sm:p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-center mb-2">Change Password</h2>
        <p className="text-center text-muted-foreground text-sm mb-6">
          Set a new password for <span className="font-semibold">{email}</span>
        </p>

        {success && (
          <p className="text-green-600 text-sm mb-3 text-center">{success}</p>
        )}
        {error.serverError && (
          <p className="text-red-500 text-sm mb-3 text-center">
            {error.serverError}
          </p>
        )}

        <div className="space-y-4">
          {/* New Password */}
          <div className="grid gap-2">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Input
                onChange={handleUserInputPass}
                value={userPass.newPassword}
                id="newPassword"
                type={showNewPass ? "text" : "password"}
                name="newPassword"
                className={`${error.newPassword ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              />
              <Button
                size="sm"
                type="button"
                onClick={() => setshowNewPass(!showNewPass)}
                disabled={isLoading}
                variant="ghost"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              >
                {showNewPass ? (
                  <EyeOff className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Eye className="w-4 h-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {error.newPassword && (
              <p className="text-red-500 text-sm">{error.newPassword}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                onChange={handleUserInputPass}
                value={userPass.confirmPassword}
                id="confirmPassword"
                type={showConfirmPass ? "text" : "password"}
                name="confirmPassword"
                className={`${error.confirmPassword ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              />
              <Button
                size="sm"
                type="button"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                disabled={isLoading}
                variant="ghost"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              >
                {showConfirmPass ? (
                  <EyeOff className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Eye className="w-4 h-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {error.confirmPassword && (
              <p className="text-red-500 text-sm">{error.confirmPassword}</p>
            )}
          </div>

          <Button
            onClick={handleChangePassword}
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" /> Changing...
              </>
            ) : (
              "Change Password"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
