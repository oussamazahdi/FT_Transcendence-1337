
"use client"
import React, { useState } from "react";

export default function TwoFA({isEnable, setView, setIsEnable}){
  const [showConfirm, setShowconfirm] = useState(false);
  const [error, setError] = useState("");
  

  const disableTwoFA = async() => {
    setError("");
    try{
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/2fa/disable`,{
        method:"post",
        credentials:"include",
      })

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error);

      console.log("TwoFA disabled successfuly");
      setIsEnable(false);
      setShowconfirm(false);
    }catch(err){
      console.log(err.message);
      setError(err.message);
    }
  }
  
  return(
    <div className="flex flex-col justify-start items-center gap-2">
      <p className="text-white font-bold text-sm md:text-xsm">Two-Factor Authentication</p>
      <p className="text-[#ABABAB] text-xs md:text-sm text-center">
        Two-factor authentication adds an extra layer of security to your account.
      </p>
      {isEnable ?       
      <button
        type="submit"
        onClick={() => setShowconfirm(true)}
        className="w-60 h-8 text-xs rounded-sm mt-4 hover:bg-[#0F2C34]/40 border-[#414141]/60 border-1 bg-[#442222] text-white hover:text-white cursor-pointer">
        Disable
      </button>
      :
      <button
        type="submit"
        onClick={() => setView("setup")}
        className="w-60 h-8 text-xs rounded-sm mt-4 hover:bg-[#0F2C34]/40 border-[#414141]/60 border-1 bg-[#070707] text-white hover:text-white cursor-pointer">
        Enable
      </button>}

      {showConfirm &&
      <div className=" fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setShowconfirm(false)}></div>
        <div className="relative z-10 bg-[#0f0f0f] border border-[#414141] p-6 rounded-lg shadow-2xl w-full max-w-120 flex flex-col items-center gap-2">
          <p className="font-bold text-sm text-center">Disable Two-Factor Authentication</p>
          <p className="text-xs text-gray-500 text-center">
            This will remove the extra security step when signing in.
          </p>
          <div className="flex justify-center items-center gap-4">
            <button
              type="submit"
              onClick={()=> disableTwoFA()}
              className="w-30 h-8 text-xs rounded-sm mt-4 hover:bg-[#442222]/40 bg-[#442222] text-[#FF4848] cursor-pointer">
              Disable 2FA
            </button>
            <button
              type="submit"
              onClick={()=> setShowconfirm(false)}
              className="w-30 h-8 text-xs rounded-sm mt-4 hover:bg-[#252525]/40 bg-[#252525] text-white hover:text-white cursor-pointer">
              Cancel
            </button>
          </div>
        </div>
      </div>}
    </div>
  )
}