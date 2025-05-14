import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ICard } from "../../../../types/functionalites.types";
import { toast, ToastContainer } from "react-toastify";

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
  if (loading) return <div className="absolute inset-0 z-50 bg-black/70 flex items-center justify-center"><h1>Loading....</h1></div>
  return (
    <div className="absolute inset-0 z-50 bg-black/70 flex items-center justify-center">
      <div className="bg-[#323940] p-10 shadow-lg rounded-lg text-white">
        <button onClick={() => navigate(-1)}>X</button>
        {card && <h1>{card.position}</h1>}
      </div>
      <ToastContainer />
    </div>
  );
};

export default CardModal;
