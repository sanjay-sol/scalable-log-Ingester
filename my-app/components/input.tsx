// Input.tsx

import React, { FC, InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  // Add any additional props you might need
  customProp?: string;
}

const Input: FC<InputProps> = ({ customProp, ...props }) => {
  return (
    <input
      className="border rounded py-2 px-4"
      {...props}
    />
  );
};

export default Input;
