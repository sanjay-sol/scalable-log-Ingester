
import React, { FC, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  customProp?: string;
}

const Button: FC<ButtonProps> = ({ customProp, ...props }) => {
  return (
    <button
      className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
      {...props}
    >
      {props.children}
    </button>
  );
};

export default Button;
