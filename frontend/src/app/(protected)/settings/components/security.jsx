"use client"
import React, { useState } from "react";
import Image from "next/image";
import { assets } from "@/assets/data";
import { useAuth } from "@/contexts/authContext";
import TwoFA from "./TwoFA";
import TwoFaSetup from "./TwoFaSetup";

//check if data empty
const PasswordInput = ({label, name, value, show, setShow, onChange}) => (
  <div className="relative w-full flex justify-center items-center">
    <input
      type={show ? "text" : "password"}
      name={name}
      required
      placeholder={label}
      value={value}
      onChange={onChange}
      className="bg-[#414141]/60 py-2 rounded-sm text-xs w-120 text-gray-200 focus:outline-none px-4 pr-10 placeholder-gray-500" 
      />
      <button onClick={()=>setShow(!show)} type="button" className="absolute right-3 top-1  text-[#ABABAB] hover:scale-105 transition-colors cursor-pointer">
        {show ? 
        <Image src={assets.eye} alt="icon" width={20} style={{ display: "inline-block" }} />
        : <Image src={assets.visible} alt="icon" height={20} style={{ display: "inline-block" }} />}
      </button>
  </div>
)

export default function Security() {
  const [showCurr, setShowcurr] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showconfirm, setShowconfirm] = useState(false);
  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirmPass: "",
  });
  const {user} = useAuth()

  // const [isEnable, setIsEnable] = useState(user.isEnable);
  const [isEnable, setIsEnable] = useState(false);
  const [view, setView] = useState("status");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="h-full flex flex-col justify-center items-center gap-3">
      <p className="font-bold ">Change Password</p>
      <p className="text-xs text-gray-500">
        Update password for enhanced account security
      </p>
      <form className="flex flex-col justify-center items-center gap-1">
        <PasswordInput label="Current password" name="current" show={showCurr} setShow={setShowcurr} value={passwords.current} onChange={handleChange} />
        <PasswordInput label="New password" name="newPass" show={showNew} setShow={setShowNew} value={passwords.newPass} onChange={handleChange} />
        <PasswordInput label="Confirm new password" name="confirmPass" show={showconfirm} setShow={setShowconfirm} value={passwords.confirmPass} onChange={handleChange} />
        <button
          type="submit"
          className="w-60 h-8 text-xs rounded-sm mt-4 hover:bg-[#0F2C34]/40 border-[#414141]/60 border-1 bg-[#070707] text-white hover:text-white cursor-pointer">
          save change
        </button>
      </form>
      {view === "status" ?
        <TwoFA isEnable={isEnable} onEnableClick={() => setView("setup")} setIsEnable={setIsEnable}/>
        :
        <TwoFaSetup onEnableClick={() =>{ setView("status"); setIsEnable(true)}}/>
      }
    </div>
  );
}
