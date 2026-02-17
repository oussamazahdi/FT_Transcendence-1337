"use client";
import React, { useState } from "react";
import { useAuth } from "@/contexts/authContext";
import TwoFA from "./TwoFA.tsx";
import TwoFaSetup from "./TwoFaSetup.tsx";
import { USER_ERROR } from "@/lib/utils.ts";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { autofetch } from "@/lib/api.tsx";
import { z } from "zod";

const changePasswordSchema = z.object({
    current: z
      .string()
      .min(8, "Current password must be at least 8 characters")
      .max(64, "Password is too long"),
    newPass: z.string()
      .min(8, "Password must be at least 8 characters")
      .max(64, "Password must not exceed 64 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
    confirmPass: z
      .string()
      .min(8, "Confirm password must be at least 8 characters")
      .max(64, "Password is too long"),
  })
  .refine((data) => data.newPass !== data.current, {
    message:
      USER_ERROR["NEW_PASSWORD_MATCHS_OLD_PASSWORD"] || USER_ERROR["default"],
    path: ["newPass"],
  })
  .refine((data) => data.newPass === data.confirmPass, {
    message:
      USER_ERROR["NEW_PASSWORDS_DO_NOT_MATCH"] || USER_ERROR["default"],
    path: ["confirmPass"],
  });

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

interface PasswordInputParams{
  label:string
  name:string
  value:string
  show:boolean
  setShow:React.Dispatch<React.SetStateAction<boolean>>
  onChange: React.ChangeEventHandler<HTMLInputElement>
}
const PasswordInput = ({ label, name, value, show, setShow, onChange }:PasswordInputParams) => (
  <div className="relative w-full">
    <input
      type={show ? "text" : "password"}
      name={name}
      required
      placeholder={label}
      value={value}
      onChange={onChange}
      className="w-full h-12 bg-[#414141]/60 rounded-xl text-xs md:max-w-120 text-gray-200 focus:outline-none px-4 pr-12 placeholder-gray-500"
    />
    <button
      onClick={() => setShow(!show)}
      type="button"
      className="absolute right-3 top-1/2 -translate-y-1/2  text-[#ABABAB] hover:scale-105 transition-colors cursor-pointer"
    >
      {show ? (
        <EyeIcon className="w-4 h-4" />
      ) : (
        <EyeSlashIcon className="w-4 h-4" />
      )}
    </button>
  </div>
);

export default function Security() {
  const [showCurr, setShowCurr] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showconfirm, setShowconfirm] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirmPass: "",
  });
  const { user } = useAuth();

  const [isEnable, setIsEnable] = useState<boolean>(!!user?.status2fa);
  const [view, setView] = useState("status");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [greeting, setGreeting] = useState("");
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof ChangePasswordForm, string>>>({});


  const handleSubmit = async (e:React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setGreeting("");
    setFieldErrors({});

    const parsed = changePasswordSchema.safeParse(passwords);
    if (!parsed.success) {
      const flat = parsed.error.flatten().fieldErrors;
      setFieldErrors({
        current: flat.current?.[0],
        newPass: flat.newPass?.[0],
        confirmPass: flat.confirmPass?.[0],
      });
      setLoading(false);
      return;
    }

    try {
      const response = await autofetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/change-password`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            oldPassword: parsed.data.current,
            newPassword: parsed.data.newPass,
            repeatNewPassword: parsed.data.confirmPass,
          }),
        },
      );

      const data = await response.json();
      if (!response.ok) 
        throw new Error(USER_ERROR[data.error] || USER_ERROR["default"]);

      setGreeting("password changed successfully");
      setPasswords({ current: "", newPass: "", confirmPass: "" });
    } catch (err:any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="h-full flex flex-col justify-start items-center gap-3 mt-6 md:mt-0 overflow-y-auto">
      <form
        onSubmit={handleSubmit}
        className="w-full flex md:flex-1 flex-col justify-start md:justify-end-safe items-center gap-2 px-4 sm:px-0 sm:max-w-105"
      >
        <p className="text-white font-bold text-sm md:text-xsm">
          Change Password
        </p>
        <p className="text-[#ABABAB] text-xs md:text-sm text-center">
          Update password for enhanced account security
        </p>
        <PasswordInput
          label="Current password"
          name="current"
          show={showCurr}
          setShow={setShowCurr}
          value={passwords.current}
          onChange={handleChange}
        />
        {fieldErrors.current && (<p className="text-red-600 text-xs px-1">{fieldErrors.current}</p>)}
        <PasswordInput
          label="New password"
          name="newPass"
          show={showNew}
          setShow={setShowNew}
          value={passwords.newPass}
          onChange={handleChange}
        />
        {fieldErrors.newPass && (<p className="text-red-600 text-xs px-1">{fieldErrors.newPass}</p>)}
        <PasswordInput
          label="Confirm new password"
          name="confirmPass"
          show={showconfirm}
          setShow={setShowconfirm}
          value={passwords.confirmPass}
          onChange={handleChange}
        />
        {fieldErrors.confirmPass && (<p className="text-red-600 text-xs px-1">{fieldErrors.confirmPass}</p>)}
        {error && (<p className="text-red-600 text-xs px-1">{error}</p>)}
        {greeting && (<p className="text-green-600 text-xs px-1">{greeting}</p>)}
        <button
          type="submit"
          disabled={loading}
          className="w-full max-w-60 h-8 text-xs rounded-sm mt-4 hover:bg-[#0F2C34]/40 border-[#414141]/60 border bg-[#070707] text-white hover:text-white cursor-pointer"
        >
          {loading ? "changing password..." : "save change"}
        </button>
        <div className="border-t border-[#FFFFFF]/23 h-1 w-full mt-3"></div>
      </form>
      <div className="md:basis-1/2">
        {view === "status" ? (
          <TwoFA
            isEnable={isEnable}
            setIsEnable={setIsEnable}
            setView={setView}
          />
        ) : (
          <TwoFaSetup setEnable={setIsEnable} setView={setView} />
        )}
      </div>
    </div>
  );
}
