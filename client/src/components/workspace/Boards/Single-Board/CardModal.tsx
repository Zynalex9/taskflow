import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ICard } from "../../../../types/functionalites.types";
import { toast, ToastContainer } from "react-toastify";
import { ChevronLeftSquareIcon } from "lucide-react";
import InListMove from "./Single-Card/InListMove";

const CardModal = () => {
  const navigate = useNavigate();
  const [card, setCard] = useState<ICard>();
  const [loading, setLoading] = useState(false);
  const { cardId } = useParams();
  const fetchCard = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `http://localhost:3000/api/card/single-card/${cardId}`,
        { withCredentials: true }
      );
      if (response.data.success) {
        setCard(response.data.data);
        console.log(response.data);
      }
    } catch (error) {
      toast.error("Error fetching cards", {
        theme: "dark",
        autoClose: 1000,
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchCard();
  }, []);
  if (loading)
    return (
      <div className="absolute inset-0 z-50 bg-black/70 flex items-center justify-center">
        <h1>Loading....</h1>
      </div>
    );
  return (
    <div className="absolute inset-0 z-50 bg-black/70 flex items-center justify-center w-full">
      <div className="bg-[#323940] p-10 shadow-lg rounded-lg text-white w-2/3">
        <div className="w-full flex items-center justify-between">
          <div className="flex gap-3">
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" name="option" className="peer hidden" />
              <div className="w-6 h-6 border border-white rounded-full flex items-center justify-center peer-checked:bg-green-500">
             <span className="text-white text-lg font-bold hidden peer-checked:block">✓</span>

              </div>
            </label>

            <h1 className="text-textP font-charlie-text-sb text-2xl">
              {card?.name}
            </h1>
          </div>
          <ChevronLeftSquareIcon onClick={() => navigate(-1)} />
        </div>
        <InListMove/>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CardModal;
