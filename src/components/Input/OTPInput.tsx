
import React, { useEffect, useRef, useState } from "react";

interface OTPInputProps {
    length: number; // Length of the OTP
    onChange?: (otp: string) => void
}

const OTPInput: React.FC<OTPInputProps> = ({ length, onChange }) => {
    const [otp, setOTP] = useState<string[]>(new Array(length).fill(""));
    const refs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        // Initialize refs
        refs.current = refs.current.slice(0, length);

        setOTP(new Array(length).fill(""))
    }, [length]);



    const handleChange = (index: number, value: string) => {
        const newOTP = [...otp];
        newOTP[index] = value;
        setOTP(newOTP);
        onChange?.(newOTP.join(''))

        // Shift focus to the next input field if available
        if (value !== "" && index < length - 1 && refs.current[index + 1]) {
            refs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && index > 0 && otp[index] === "") {
            // Shift focus to the previous input field on Backspace press if available
            refs.current[index - 1]?.focus();
        }
    };

    return (
        <div className="flex justify-center items-center">
            {otp.map((digit, index) => (
                <input
                    key={index}
                    ref={(el) => (refs.current[index] = el)}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-3xl mx-1 text-center border-2 border-red-500"
                />
            ))}
        </div>
    );
};

export default OTPInput;

