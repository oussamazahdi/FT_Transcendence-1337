"use client";
import React, { useState } from "react";
import { useAuth } from "@/contexts/authContext";
import TwoFA from "./TwoFA";
import TwoFaSetup from "./TwoFaSetup";
import { USER_ERROR } from "@/lib/utils";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

//check if data empty
const PasswordInput = ({ label, name, value, show, setShow, onChange }) => (
  <div className="relative w-full">
    <input
      type={show ? "text" : "password"}
      name={name}
      required
      placeholder={label}
      value={value}
      onChange={onChange}
      className="w-full bg-[#414141]/60 rounded-sm text-xs md:max-w-120 text-gray-200 focus:outline-none px-4 pr-12 py-3 md:py-2 placeholder-gray-500"
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

  const [isEnable, setIsEnable] = useState(user.status2fa);
  const [view, setView] = useState("status");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [greeting, setGreeting] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setGreeting("");

    try {
      if (passwords.current === passwords.newPass)
        throw new Error(
          USER_ERROR["NEW_PASSWORD_MATCHS_OLD_PASSWORD"] ||
            USER_ERROR["default"],
        );
      if (passwords.newPass !== passwords.confirmPass)
        throw new Error(
          USER_ERROR["NEW_PASSWORDS_DO_NOT_MATCH"] || USER_ERROR["default"],
        );

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/change-password`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            oldPassword: passwords.current,
            newPassword: passwords.newPass,
            repeatNewPassword: passwords.confirmPass,
          }),
        },
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setGreeting("password changed successfully");
      setPasswords({ current: "", newPass: "", confirmPass: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="h-full flex flex-col justify-start md:justify-center items-center gap-3 mt-6 md:mt-0">
      <form
        onSubmit={handleSubmit}
        className="w-full flex md:flex-1 flex-col justify-start md:justify-end-safe items-center gap-2 px-4 sm:px-0 sm:max-w-[420px]"
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
        <PasswordInput
          label="New password"
          name="newPass"
          show={showNew}
          setShow={setShowNew}
          value={passwords.newPass}
          onChange={handleChange}
        />
        <PasswordInput
          label="Confirm new password"
          name="confirmPass"
          show={showconfirm}
          setShow={setShowconfirm}
          value={passwords.confirmPass}
          onChange={handleChange}
        />
        {error && (
          <p className="text-red-600 text-xs text-center px-3 py-1 bg-red-300/20 border-1">
            {error}
          </p>
        )}
        {greeting && (
          <p className="text-white text-xs text-center w-full h-6 bg-orange-300/20 border-1 border-green-500/20 p-1">
            {greeting}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full max-w-60 h-8 text-xs rounded-sm mt-4 hover:bg-[#0F2C34]/40 border-[#414141]/60 border-1 bg-[#070707] text-white hover:text-white cursor-pointer"
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
