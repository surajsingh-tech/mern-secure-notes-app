import React from "react";

export default function VerifyEmail() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl bg-white rounded-2xl shadow-sm p-6 sm:p-10 text-center">
        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
          Verify Your Email
        </h1>

        {/* Description */}
        <p className="text-muted-foreground text-sm sm:text-base mb-6">
          We’ve sent you an email to verify your account. Please check your
          inbox and click the verification link.
        </p>

        {/* Illustration */}
        <div className="flex justify-center mb-6">
          <img
            src="https://cdn-icons-png.flaticon.com/512/561/561127.png"
            alt="Email Icon"
            className="w-20 h-20 sm:w-24 sm:h-24"
          />
        </div>
      </div>
    </div>
  );
}
