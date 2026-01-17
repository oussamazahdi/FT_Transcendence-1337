import React from "react";

const Input = ({
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
      className={`w-full p-3 h-8 rounded bg-[#4D4D4D]/40 text-white text-xs placeholder-[#FFFFFF]/23 focus:outline-none ${className}`}
    />
  );
};

export default Input;
