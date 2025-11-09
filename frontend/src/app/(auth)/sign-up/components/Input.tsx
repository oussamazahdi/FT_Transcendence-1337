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
      className={`w-81 h-8 px-4 py-2 rounded bg-white/10 text-white text-xs placeholder-gray-400 focus:outline-none ${className}`}
    />
  )
}

export default Input
