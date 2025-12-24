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
  const [showCurr, setShowCurr] = useState(false);
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [greeting, setGreeting] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setGreeting("");
    
    try{
      if (passwords.current === passwords.newPass)
        throw new Error("New password must be different.")
      if (passwords.newPass !== passwords.confirmPass)
        throw new Error("Passwords do not match.")

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/change-password`,{
        method:"POST",
        headers:{
          "Content-type":"application/json"
        },
        credentials: "include",
        body: JSON.stringify({
          oldPassword: passwords.current,
          newPassword: passwords.newPass,
          repeatNewPassword: passwords.confirmPass
          }
        )
      })

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error);

      setGreeting("password changed successfully")
      setPasswords({ current: "", newPass: "", confirmPass: "" });
    }catch(err){
      setError(err.message);
      console.log("failed to change password")
    }finally{
      setLoading(false);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="h-full flex flex-col justify-center items-center gap-3">
      <form onSubmit={handleSubmit} className="flex flex-col justify-end items-center gap-1 h-full basis-1/2">
      <p className="font-bold ">Change Password</p>
      <p className="text-xs text-gray-500">
        Update password for enhanced account security
      </p>
        <PasswordInput label="Current password" name="current" show={showCurr} setShow={setShowCurr} value={passwords.current} onChange={handleChange} />
        <PasswordInput label="New password" name="newPass" show={showNew} setShow={setShowNew} value={passwords.newPass} onChange={handleChange} />
        <PasswordInput label="Confirm new password" name="confirmPass" show={showconfirm} setShow={setShowconfirm} value={passwords.confirmPass} onChange={handleChange} />
        {error && (<p className="text-red-600 text-xs text-center w-full h-6 bg-red-300/20 border-1 p-1">{error}</p>)}
        {greeting && (<p className="text-white text-xs text-center w-full h-6 bg-orange-300/20 border-1 border-green-500/20 p-1">{greeting}</p>)}
        <button
          type="submit"
          disabled={loading}
          className="w-60 h-8 text-xs rounded-sm mt-4 hover:bg-[#0F2C34]/40 border-[#414141]/60 border-1 bg-[#070707] text-white hover:text-white cursor-pointer">
          {loading ? "changing password..." :"save change"}
        </button>
        <div className="border-t border-[#FFFFFF]/23 h-1 w-120 mt-3"></div>
      </form>
      <div className="basis-1/2">
        {view === "status" ?
          <TwoFA isEnable={isEnable} onEnableClick={() => setView("setup")} setIsEnable={setIsEnable}/>
          :
          <TwoFaSetup onEnableClick={() =>{ setView("status"); setIsEnable(true)}}/>
        }
      </div>
    </div>
  );
}
