import { usePreventScroll } from "./PreventScroll"; // You'll need to create this hook

import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { AlignLeft, ChevronLeftSquareIcon } from "lucide-react";
import InListMove from "./Single-Card/InListMove";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store/store";
import { fetchSingleCard } from "../../../../store/CardSlice";
import LabelsAndNotification from "./Single-Card/LabelsAndNotification";
import Description from "./Single-Card/Description";

const CardModal = () => {
  const [showDescription, setShowDescription] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { card, error, loading } = useSelector(
    (state: RootState) => state.card
  );
  const { cardId } = useParams();
  const background = location.state?.background;

  usePreventScroll(true);

  useEffect(() => {
    if (cardId) {
      dispatch(fetchSingleCard(cardId));
    }
  }, [cardId, dispatch]);

  const handleClose = () => {
    navigate(background?.pathname || -1);
  };

  if (loading)
    return (
      <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center pt-[60px]">
        <h1>Loading....</h1>
      </div>
    );

  if (error)
    return (
      <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center pt-[60px]">
        <h1>Error fetching cards....</h1>
      </div>
    );

  return (
    <>
      <div
        className="fixed inset-0 z-[90] bg-black/70 top-[60px]"
        onClick={handleClose}
      />

      <div className=" fixed inset-0 z-[100] overflow-y-auto flex items-start justify-center p-4 top-[60px]">
        <div
          className="bg-[#323940] shadow-lg rounded-lg text-white w-full max-w-4xl my-4  min-h-screen"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <label className="cursor-pointer">
                  <input
                    type="checkbox"
                    name="option"
                    className="peer hidden"
                  />
                  <div className="w-6 h-6 border border-white rounded-full flex items-center justify-center peer-checked:bg-green-600"></div>
                </label>

                <h1 className="text-textP font-charlie-text-sb text-2xl pl-4">
                  {card?.name}
                </h1>
              </div>

              <ChevronLeftSquareIcon
                onClick={handleClose}
                className="cursor-pointer hover:text-gray-300"
                size={24}
              />
            </div>

            <div className="pl-10">
              <InListMove />
            </div>

            <div className="w-full flex flex-col md:flex-row mt-4">
              <div className="w-full md:w-2/3 md:pr-4">
                <LabelsAndNotification />
                {showDescription ? (
                  <>
                    <div className="flex gap-5 items-center pt-3">
                      <AlignLeft className="text-textP" />
                      <h1 className="text-textP font-charlie-text-sb text-md">
                        Description
                      </h1>
                    </div>
                    <Description />
                    <div className="ml-10">
                      <button
                        className="m-1 px-3 py-2 bg-fprimary/60 rounded font-charlie-text-r"
                        onClick={() => setShowDescription(false)}
                      >
                        Close
                      </button>
                      <button className="m-1 px-3 py-2 bg-primary rounded font-charlie-text-r">
                        Save
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex gap-5 items-center pt-3">
                      <AlignLeft className="text-textP" />
                      <h1 className="text-textP font-charlie-text-sb text-md">
                        Description
                      </h1>
                    </div>
                    <div className="ml-10">
                      <button
                        className="w-full bg-[#0D0F11] text-start p-4 mt-1 rounded-sm font-charlie-display-sm text-textP cursor-pointer"
                        onClick={() => setShowDescription(true)}
                      >
                        Add a more detailed description…
                      </button>
                    </div>
                  </>
                )}
              </div>

              <div className="w-full md:w-1/3 mt-4 md:mt-0 bg-[#22272B] p-4 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CardModal;
