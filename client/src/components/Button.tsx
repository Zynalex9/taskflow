import React from "react";

interface ButtonProps {
  buttonText: string;
}

const Button: React.FC<ButtonProps> = ({ buttonText }) => {
  return (
    <button className="bg-white shadow-xl cursor-pointer px-4 py-4 mt-3 rounded text-black">
      {buttonText}
    </button>
  );
};

export default Button;
