import react from "react"

export default function TwoFaSetup ({onEnableClick}){
  return (
    <div>
      <p>Hna ta7 rial hna la3bo 3lih</p>
      <button
        type="submit"
        onClick={onEnableClick}
        className="w-60 h-8 text-xs rounded-sm mt-4 hover:bg-[#0F2C34]/40 border-[#414141]/60 border-1 bg-[#070707] text-white hover:text-white cursor-pointer">
        Enable
      </button>
    </div>
  )
}