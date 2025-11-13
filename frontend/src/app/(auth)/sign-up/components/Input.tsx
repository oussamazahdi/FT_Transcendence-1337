import React from 'react'

interface InputProps {
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  type = "text",
  value,
  onChange,
  placeholder,
  required = true,
  className = "",
}) => {
  return (
   <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={`w-81 h-8 px-4 py-2 rounded bg-[#4D4D4D]/40 text-white text-xs placeholder-[#FFFFFF]/23 focus:outline-none ${className}`}
    />
  )
}

export default Input
