"use client";
import React from "react";
import { assets } from "@/assets/data";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Input from "./components/Input";
import ConnectWith from "@/components/ConnectWith";
import { AUTH_ERRORS } from "@/lib/utils";

export default function SignUp() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8){
      setError("Password must be at least 8 characters.")
      return;
    }
    setLoading(true);

    try {

      if (firstname.length < 3 || lastname.length < 3 || username.length < 3)
        throw new Error(AUTH_ERRORS["INVALID_NAME_LENGTH"])
      const reply = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            firstname,
            lastname,
            username,
            email,
            password,
          }),
        },
      );

      if (!reply.ok) {
        const errorData = await reply.json();
        const errorMessage = AUTH_ERRORS[errorData.error] || AUTH_ERRORS["default"];
        throw new Error(errorMessage);
      }

      const data = await reply.json();
      // console.log("Signup successful:", data);
      router.replace("/sign-up/email-verification");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="flex flex-col md:flex-row justify-center md:justify-between bg-[#1A1A1A]/75 w-full md:w-[800px] h-[480px] rounded-xl mx-4 md:mx-0">
        <div className="flex flex-col items-center justify-center w-full md:w-1/2 p-2 md:p-2">
          <form
            onSubmit={handleSubmit}
            className="space-y-1 flex flex-col items-center justify-center text-white w-full px-10"
          >
            <h1 className="text-xl md:text-3xl font-bold text-center">
              Create an account
            </h1>
            <p className="text-center text-[#A6A6A6] text-xs/3 md:text-xs mb-2 md:mb-6">
              Enter your personal data to create your account
            </p>
            <div className="flex flex-col md:flex-row gap-1 w-full">
              <Input
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                placeholder="Firstname"
                />
              <Input
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                placeholder="Lastname"
                />
            </div>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nickname"
            />
            <Input
              type="email"
              value={email}
              onChange={(e) => setemail(e.target.value)}
              placeholder="Email address"
            />
            <Input
              type="password"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
              placeholder="Password"
            />
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
            />

            {error && (
              <p className="text-red-500 text-xs text-center">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className=" w-full mt-3 px-4 py-2 bg-[#0F2C34] text-white text-xs rounded hover:bg-[#245664] disabled:bg-gray-500 transition"
            >
              {loading ? "Creating account..." : "Continue"}
            </button>

            <p className="text-[#A6A6A6] text-xs text-center">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="text-green-400 hover:text-green-300"
              >
                Sign In
              </Link>
            </p>
          </form>
          <ConnectWith />
        </div>

        <div className="hidden md:block relative overflow-hidden m-2 bg-white rounded-3xl w-[400px]">
          <Image
            src={assets.SignUp_image}
            alt="logo"
            fill={true}
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
