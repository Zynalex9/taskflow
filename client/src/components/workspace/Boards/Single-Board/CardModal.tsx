import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ChevronLeftSquareIcon } from "lucide-react";
import InListMove from "./Single-Card/InListMove";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store/store";
import { fetchSingleCard } from "../../../../store/CardSlice";
import LabelsAndNotification from "./Single-Card/LabelsAndNotification";

const CardModal = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { card, error, loading } = useSelector(
    (state: RootState) => state.card
  );
  const { cardId } = useParams();

  useEffect(() => {
    dispatch(fetchSingleCard(cardId!));
  }, []);

  if (loading)
    return (
      <div className="absolute inset-0 z-50 bg-black/70 flex items-center justify-center">
        <h1>Loading....</h1>
      </div>
    );
  if (error)
    return (
      <div className="absolute inset-0 z-50 bg-black/70 flex items-center justify-center">
        <h1>Error fetching cards....</h1>
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
                <span className="text-white text-lg font-bold hidden peer-checked:block">
                  ✓
                </span>
              </div>
            </label>

            <h1 className="text-textP font-charlie-text-sb text-2xl">
              {card?.name}
            </h1>
          </div>
          <ChevronLeftSquareIcon onClick={() => navigate(-1)} />
        </div>
        <InListMove />
        <div className="w-full flex">
          <div className="w-2/3">
            <LabelsAndNotification/>
          </div>
          <div className="siderbar w-1/3 bg-red-500 p-4"></div>
        </div>
      </div>
    </div>
  );
};

export default CardModal;
