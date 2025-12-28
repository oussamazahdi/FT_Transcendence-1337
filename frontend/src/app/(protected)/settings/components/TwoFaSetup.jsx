"use client"
import react, { useRef, useState, useEffect } from "react"
import Image from "next/image"

export default function TwoFaSetup ({setEnable, setView}){
  const [TwoFAcode, setTwoFAcode] = useState(new Array(6).fill(""));
  const inputRefs = useRef([]);
  const [imagePreview, setImagePreview] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setError("");
    const getQrCode = async()=>{
      try{
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/2fa/setup`,{
          method:"post",
          credentials:"include"
        })
        
        const data = await response.json();
        if(!response.ok)
          throw new Error(data.error);

        setImagePreview(data.qr)
      }catch(err){
        console.log(err.message);
        setError(err.message);
      }finally{
        setLoading(false);
      }
    }
    getQrCode();
  },[])

  const VerifyQrCode = async () => {
    setError("");
    console.log("hna tah rial")
    try{
      const tokenString = TwoFAcode.join("");
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/2fa/enable`,{
        method:"post",
        credentials:"include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: tokenString }),
      })

      const data = await response.json();
      if(!response.ok)
        throw new Error(data.error)

      console.log("hna nla3bo 3lih")

      setEnable(true);
      setView("status");
    }catch(err){
      console.log(err.message)
      setError(err.message)
    }
  }

  const handleChange = (element, index) => {
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
    <div className="flex flex-col justify-start items-center gap-2">
      <p className="font-bold ">Two-Factor Authentication</p>
      <p className="text-xs text-gray-500">Scan the QR code with your authentication app or manually enter the code below.</p>
      <div className="border-1 border-dashed w-24 h-24 p-[2px] rounded-[9px]">
        {!loading ? (<Image src={imagePreview} alt="icon to replace later" width={90} height={90} className="rounded-[6px]"/>)
        :
        (<p>Loading...</p>)}
      </div>
      <p className="text-xs text-gray-500">Enter your 2FA code here</p>
      <div className="flex gap-2">
        {TwoFAcode.map((data, index) => (
          <input
            key={index}
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
      {error && <p>{error}</p>}
      <button
        type="submit"
        onClick={() => VerifyQrCode()}
        className="w-60 h-8 text-xs rounded-sm mt-4 hover:bg-[#0F2C34]/40 border-[#414141]/60 border-1 bg-[#070707] text-white hover:text-white cursor-pointer">
        Enable
      </button>
    </div>
  )
}