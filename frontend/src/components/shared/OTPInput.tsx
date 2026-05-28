import React, { useRef, useState, useEffect } from "react";

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  value,
  onChange,
  disabled = false,
}) => {
  const [code, setCode] = useState<string[]>(new Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Sync external value with internal state array
    const valueArray = value.split("").slice(0, length);
    const newCode = new Array(length).fill("");
    valueArray.forEach((char, index) => {
      newCode[index] = char;
    });
    setCode(newCode);
  }, [value, length]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value;
    if (/[^0-9]/.test(val)) return; // Only allow numbers

    const newCode = [...code];
    // Take only the last character in case they pasted or typed multiple quickly
    newCode[index] = val.substring(val.length - 1);
    setCode(newCode);
    onChange(newCode.join(""));

    // Move to next input if there's a value
    if (val && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (!code[index] && index > 0) {
        // If current is empty and user presses backspace, focus previous
        const newCode = [...code];
        newCode[index - 1] = "";
        setCode(newCode);
        onChange(newCode.join(""));
        inputRefs.current[index - 1]?.focus();
      } else {
        const newCode = [...code];
        newCode[index] = "";
        setCode(newCode);
        onChange(newCode.join(""));
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").replace(/[^0-9]/g, "").slice(0, length);
    if (!pastedData) return;

    const newCode = [...code];
    pastedData.split("").forEach((char, index) => {
      if (index < length) {
        newCode[index] = char;
      }
    });
    setCode(newCode);
    onChange(newCode.join(""));
    
    // Focus the next empty input or the last one
    const nextFocusIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[nextFocusIndex]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center sm:justify-between w-full">
      {code.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]*"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          className={`w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold bg-surface-container-low border ${
            digit ? "border-primary text-primary" : "border-outline-variant text-on-surface"
          } rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200 disabled:opacity-50`}
        />
      ))}
    </div>
  );
};

export default OTPInput;
