"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { assets } from "@/assets/data";
import Input from "../sign-up/components/Input";
import ConnectWith from "@/components/ConnectWith";
import { useAuth } from "@/contexts/authContext";
import { AUTH_ERRORS } from "@/lib/utils";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (password.length < 8)
        throw new Error("Password must be at least 8 characters");
      const reply = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email,
            password,
          }),
        },
      );

      if (!reply.ok) {
        const errorData = await reply.json();
        const errorMessage =
          AUTH_ERRORS[errorData.error] || AUTH_ERRORS["default"];
        throw new Error(errorMessage);
      }

      const data = await reply.json();
      login(data.userData);
      console.log("tloga meziane");

      router.push("/dashboard");
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="flex flex-col md:flex-row justify-center md:justify-between bg-[#1A1A1A]/75 w-full md:w-[800px] h-[480px] rounded-xl mx-4 md:mx-0">
        <div className="flex flex-col items-center justify-center text-white w-full md:w-1/2 p-6 md:p-2">
          <h1 className="text-3xl font-bold text-center">Welcome back</h1>
          <p className="text-center text-[#A6A6A6] text-xs ">
            Sign in to access to your profile, games,
            <br />
            and chat with your friends{" "}
          </p>
          <form
            onSubmit={handleSubmit}
            className="space-y-1 mt-6 w-full max-w-xs"
          >
            <div>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-mail"
              />
            </div>

            <div>
              <Input
                type="password"
                value={password}
                onChange={(e) => setpassword(e.target.value)}
                placeholder="your password"
              />
            </div>
            {error && (
              <p className="text-red-600 text-xs text-center px-3 py-1 bg-red-300/20 border-1">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className=" w-full px-4 py-2 bg-teal-950 text-white rounded hover:bg-green-700 disabled:bg-gray-500 transition"
            >
              {loading ? "login ..." : "log in"}
            </button>
          </form>
          <p className="text-gray-400 text-center text-xs mt-1">
            {"Don't have an account? "}
            <Link
              href="/sign-up"
              className="text-green-400 hover:text-green-300"
            >
              Sign up
            </Link>
          </p>
          <ConnectWith />
        </div>
        <div className="hidden md:block relative overflow-hidden m-2 bg-white rounded-xl w-full md:w-1/2">
          <Image
            src={assets.signIn_image}
            alt="logo"
            fill={true}
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default SignIn;
