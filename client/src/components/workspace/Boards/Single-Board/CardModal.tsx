import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CardModal = () => {
    const navigate = useNavigate()
  return (
    <div className="absolute inset-0 z-50 bg-black/70 flex items-center justify-center">
      <div className="bg-[#323940] p-10 shadow-lg rounded-lg text-white">
        
        <button onClick={(()=>navigate(-1))}>X</button>
      </div>
    </div>
  );
};

export default CardModal;
