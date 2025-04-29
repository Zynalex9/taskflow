import React from "react";

const InputBox = () => {
  return (
    <div className="w-full bg-[rgb(244,245,247)] py-20 mt-10">
      <h1 className="text-center text-3xl text-heading font-charlie-text-r">
        Get started with Taskflow today
      </h1>
      <div className="flex items-center justify-center mt-3">
        <input
          type="text"
          placeholder="Email"
          className="bg-white w-[380px] rounded p-4 font-charlie-text-r focus:outline-none focus:ring-blue-500 focus:ring-2"
        />
        <button className="bg-primary rounded-lg px-2 py-4 mx-2 text-white transition-all duration-300 hover:bg-blue-700 font-charlie-text-r">
          Sign up - It's free
        </button>
      </div>
    </div>
  );
};

export default InputBox;
