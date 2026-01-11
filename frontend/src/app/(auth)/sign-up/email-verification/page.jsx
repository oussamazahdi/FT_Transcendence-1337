"use client";
import React, { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { assets } from "@/assets/data";
import { useRouter } from "next/navigation";
import { AUTH_ERRORS } from "@/lib/utils";

const EmailVerification = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputRefs = useRef([]);
  const [error, setError] = useState("");

  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const hasFetchedRef = useRef(false);

  const router = useRouter();

  const sendVerificationCode = useCallback(async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/resendCode`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = AUTH_ERRORS[data.error] || AUTH_ERRORS["default"];
        throw new Error(errorMessage);
      }
    } catch (err) {
      setError(err.message);
    }
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const timeoutId = setTimeout(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timeoutId);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  useEffect(() => {
    if (hasFetchedRef.current) return;

    hasFetchedRef.current = true;

    sendVerificationCode();
  }, [sendVerificationCode]);

  const handleSubmite = async (e) => {
    const verificationCode = otp.join("");
    if (verificationCode.length < 6) {
      setError("Please enter the full 6-digit code.");
      return;
    }
    setError("");
    setIsVerifying(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/emailVerification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ code: verificationCode }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = AUTH_ERRORS[data.error] || AUTH_ERRORS["default"];
        throw new Error(errorMessage);
      }
      router.replace("/sign-up/email-verification/select-image");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setIsResending(true);
    setError("");

    try {
      await sendVerificationCode();

      setTimer(30);
      setCanResend(false);
    } catch (err) {
      setError("Failed to resend code.");
    } finally {
      setIsResending(false);
    }
  };

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (
      e.key === "Backspace" &&
      !otp[index] &&
      index > 0 &&
      inputRefs.current[index - 1]
    ) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePast = (e) => {
    e.preventDefault();
    const data = e.clipboardData.getData("text");

    if (!/^\d{6}$/.test(data)) return;

    const splitCode = data.split("");
    setOtp(splitCode);

    inputRefs.current[5]?.focus();
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="flex flex-col md:flex-row justify-center md:justify-between bg-[#1A1A1A]/75 w-full md:w-[800px] h-[480px] rounded-xl mx-4 md:mx-0">
        <div className="flex flex-col items-center justify-center w-full md:w-1/2 p-6">
          <h1 className="text-white text-lg font-bold">Verify your identity</h1>
          <h2 className="text-[#A6A6A6] text-sm px-6 text-center">
            We've sent a 6-digit code to{" "}
            <span className="text-white">You@Exemple.com</span>
          </h2>
          <div className="flex gap-2 mb-1">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                ref={(el) => (inputRefs.current[index] = el)}
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePast}
                className="w-8 bg-[#4D4D4D]/40 border border-transparent rounded-lg text-center text-white text-xl font-bold focus:outline-none focus:border-[#0F2C34] focus:ring-1 focus:ring-[#0F2C34] transition-all"
              />
            ))}
          </div>
          <div className="flex flex-col items-center text-gray-500 text-sm">
            <p>Didn't receive the code?</p>
            <button
              onClick={handleResend}
              disabled={!canResend || isResending}
              className="text-white hover:underline font-medium"
            >
              {isResending
                ? "Sending..."
                : canResend
                  ? "Resend Code"
                  : `Resend code in ${timer}s`}
            </button>
          </div>
          {error && <p className="text-red-500 text-xs text-center">{error}</p>}
          <button
            onClick={handleSubmite}
            disabled={isVerifying || otp.join("").length < 6}
            className="self-center w-auto px-10 md:px-20 py-1 text-white bg-teal-950 rounded hover:bg-green-700 disabled:bg-gray-500 transition-all"
          >
            {isVerifying ? "Verifying..." : "Verify"}
          </button>
        </div>
        <div className="hidden md:block relative overflow-hidden m-2 bg-white rounded-3xl w-[400px]">
          <Image
            src={assets.loginImg}
            alt="logo"
            fill={true}
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
