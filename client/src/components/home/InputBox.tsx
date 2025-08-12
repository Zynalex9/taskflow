import { useState } from "react";
import { useNavigate } from "react-router-dom";

const InputBox = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  return (
    <div className="w-full max-lg:bg-linear-to-r max-lg:from-violet-500 max-lg:to-fuchsia-500  bg-[rgb(244,245,247)] py-20 mt-10">
      <h1 className="text-center max-lg:text-white text-3xl text-heading font-charlie-text-r">
        Get started with Taskflow today
      </h1>
      <div className="flex items-center justify-center mt-3">
        <input
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              navigate("/user/sign-up", { state: { email } });
            }
          }}
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="bg-white hidden not-last:lg:block w-[380px] rounded p-4 font-charlie-text-r focus:outline-none focus:ring-blue-500 focus:ring-2"
        />
        <button
          onClick={() => {
            navigate("/user/sign-up", { state: { email } });
          }}
          className="bg-blue-primary max-lg:w-full max-lg:mt-10 rounded-lg px-2 py-4 mx-2 text-white transition-all duration-300 hover:bg-blue-700 font-charlie-text-r"
        >
          Sign up - It's free
        </button>
      </div>
    </div>
  );
};

export default InputBox;
