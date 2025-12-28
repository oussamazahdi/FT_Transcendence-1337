"use client"
import React, { useState, useRef } from 'react'
import { assets } from '@/assets/data'
import Image from 'next/image'
import { useRouter } from "next/navigation";
import { AUTH_ERRORS } from '@/lib/utils';

const TwoFA = () => {
  const [loading, setLoading] = useState(false)
  const [TwoFAcode, setTwoFAcode] = useState(new Array(6).fill(""));
  const inputRefs = useRef([]);
  const [error, setError] = useState("");
  const router = useRouter();

  const VerifyQrCode = async () => {
    setLoading(true);
    setError("");
    try{
      const twofaToken = TwoFAcode.join("");
      if(!twofaToken)
          throw new Error("enter the code firstly");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/2fa/verify`,{
        method:"post",
        credentials:"include",
        headers:{
          "Content-Type": "application/json",
        },
        body: JSON.stringify({token: twofaToken})
      })
      const data = await response.json();
      if(!response.ok){
        throw new Error(AUTH_ERRORS[data.error] || AUTH_ERRORS["default"])
      }

      router.push('/dashboard');
    }catch(err){
      setError(err.message);
      console.log(err.message);
    }finally{
      setLoading(false)
    }
  }

  const handleChange = (element, index) => {
    console.log(element);
    if (isNaN(element.value)) 
      return;
    const newTwoFAcode = [...TwoFAcode];
    newTwoFAcode[index] = element.value;
    setTwoFAcode(newTwoFAcode);

    if (element.value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (
      e.key === "Backspace" &&
      !TwoFAcode[index] &&
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
    setTwoFAcode(splitCode);

    inputRefs.current[5]?.focus();
  };
  
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="flex flex-row  justify-between bg-[#1A1A1A]/75 w-[800px] h-[480px] rounded-xl">
        <div className='flex flex-col justify-center items-center w-[400px]'>
          <p className='text-xl font-bold text-white'>Two-Factor Authentication</p>
          <p className='text-xs text-[#A6A6A6]'>manually enter the code below.</p>
          <div className="flex gap-2 my-3">
            {TwoFAcode.map((data, index) => (
              <input
                key={index}
                required
                type="text"
                maxLength="1"
                ref={(el) => (inputRefs.current[index] = el)}
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={(handlePast)}
                className="w-8 bg-[#4D4D4D]/40 border border-transparent rounded-lg text-center text-white text-xl font-meduim focus:outline-none focus:border-[#0F2C34] focus:ring-1 focus:ring-[#0F2C34] transition-all"
              />
            ))}
          </div>
          {error && (<p className="text-red-600 text-xs text-center px-3 py-1 bg-red-300/20 border-1">{error}</p>)}
          <button
            type="submit"
            disabled={loading}
            onClick={()=>VerifyQrCode()}
            className="px-30 py-2 mt-2 text-sm bg-[#0F2C34] text-white rounded hover:bg-green-500/40 disabled:bg-gray-500 transition-all cursor-pointer"
          >
            {loading ? "Verifing..." : "Verify"}
          </button>
        </div>      
        <div className="relative overflow-hidden m-2 bg-white rounded-xl w-[400px]">
          <Image
            src={assets.signIn_image}
            alt="logo"
            fill={true}
            className="object-cover"
          />
         </div>
      </div>
    </div>
  )
}

export default TwoFA
