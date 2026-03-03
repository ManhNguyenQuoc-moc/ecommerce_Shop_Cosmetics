import React, { useState } from "react";

const MyInput = ({
  type = "text",
  id,
  name,
  placeholder,
  defaultValue,
  onChange,
  className = "",
  min,
  max,
  step,
  disabled = false,
  success = false,
  error = false,
  hint,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType =
    isPassword && showPassword ? "text" : type;

  let inputClasses = `
    h-11 w-full rounded-lg px-4 text-sm
    border shadow-sm transition-all
    placeholder:text-gray-400
    bg-white text-gray-900
    border-gray-300
    focus:outline-none focus:ring-2 focus:ring-indigo-500/20
    focus:border-indigo-500
    dark:bg-gray-900 dark:text-white
    dark:border-gray-700
    ${className}
  `;

  if (disabled) {
    inputClasses += `
      cursor-not-allowed
      bg-gray-100 text-gray-400
      border-gray-200
      dark:bg-gray-800 dark:text-gray-500
    `;
  } else if (error) {
    inputClasses += `
      border-red-500 text-red-600
      focus:border-red-500 focus:ring-red-500/20
    `;
  } else if (success) {
    inputClasses += `
      border-green-500 text-green-600
      focus:border-green-500 focus:ring-green-500/20
    `;
  }

  return (
    <div className="relative w-full">
      <input
        {...props}
        type={inputType}
        id={id}
        name={name}
        placeholder={placeholder}
        defaultValue={defaultValue}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className={inputClasses}
      />

      {isPassword && !disabled && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="
            absolute right-3 top-1/2 -translate-y-1/2
            text-gray-400 hover:text-indigo-500
            transition-colors
          "
        >
        </button>
      )}

      {hint && (
        <p
          className={`mt-1.5 text-xs ${
            error
              ? "text-red-600"
              : success
              ? "text-green-600"
              : "text-gray-500"
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
};

export default MyInput;