import { useState } from "react";

const FunctionsInfo = () => {
  const [isRuleOpen, setIsRuleOpen] = useState<Boolean>(false);
  const [isRuleOpen2, setIsRuleOpen2] = useState<Boolean>(false);

  return (
    <div className="">
      <div className="w-[90%] flex max-lg:flex-col gap-4 mx-auto my-10">
        <div className="lg:w-1/2">
          <img
            src="https://images.ctfassets.net/rz1oowkt5gyp/gDxATy5dGJHEh4w2fiBBL/094d1af9ee7825a3f1e5ea7a1b90678d/Spot-Illo_Rules.svg"
            alt=""
          />
        </div>
        <div className="lg:w-1/2 lg:pl-24">
          <h1 className="text-4xl py-1 text-heading font-charlie-display-sm ">
            Rule your boards
          </h1>
          <div className="w-1/4 my-2 p-0.5 bg-linear-to-r from-[#41389A] to-[#4985EA] border-0 rounded"></div>
          <p className="text-lg font-charlie-text-r py-2">
            Setting rules means important tasks won’t fall through the cracks.
            Just set a trigger and the actions to be performed, and let Butler
            run the show. Doesn’t that rule?
          </p>
          <button
            onClick={() => setIsRuleOpen(!isRuleOpen)}
            className="text-2xl font-charlie-display-sm"
          >
            {isRuleOpen ? "+" : "- "} <span>How to try it</span>
          </button>
          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${
              isRuleOpen
                ? "opacity-100 max-h-[500px] mt-4"
                : "opacity-0 max-h-0"
            }`}
          >
            <ul className="list-disc mt-4 text-md space-y-4 font-charlie-text-r">
              <li>
                When a card is created in a "To Do" list, add the "Steps"
                checklist so that you don’t miss a beat.
              </li>
              <li>
                When you enter a card name ending with a date, set the card to
                be due on that date. Perfect for when emailing cards to your
                board.
              </li>
              <li>
                When a card is marked as “Done,” automatically mark the due date
                as complete, cross off checklist items, and remove members.
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="w-[90%] flex max-lg:flex-col flex-row-reverse gap-4 mx-auto my-28">
        <div className="lg:w-1/2">
          <img
            src="https://images.ctfassets.net/rz1oowkt5gyp/5lmKFfNOwTKgmL2RXmzcRB/8e34e3a16c802982d93b26aa2460f1ba/spot-illo-butler-button.svg"
            alt=""
          />
        </div>
        <div className="lg:w-1/2 lg:pl-24">
          <h1 className=" text-3xl lg:text-4xl py-1 text-heading font-charlie-display-sm ">
            Move work forward
          </h1>
          <div className="w-1/4 my-2 p-0.5 bg-linear-to-r from-[#41389A] to-[#4985EA] border-0 rounded"></div>
          <p className="text-lg font-charlie-text-r py-2">
            Get to the next step faster with custom card and board buttons. Card
            buttons appear on the back of every card, and board buttons are in
            the top right corner. They both perform a series of actions in a
            single click!
          </p>
          <button
            onClick={() => setIsRuleOpen2(!isRuleOpen2)}
            className="text-2xl font-charlie-display-sm"
          >
            {isRuleOpen2 ? "+" : "- "} <span>How to try it</span>
          </button>

          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${
              isRuleOpen2
                ? "opacity-100 max-h-[500px] mt-4"
                : "opacity-0 max-h-0"
            }`}
          >
            <ul className="list-disc mt-4 text-md space-y-4 font-charlie-text-r">
              <li>
                When a card is created in a "To Do" list, add the "Steps"
                checklist so that you don’t miss a beat.
              </li>
              <li>
                When you enter a card name ending with a date, set the card to
                be due on that date. Perfect for when emailing cards to your
                board.
              </li>
              <li>
                When a card is marked as “Done,” automatically mark the due date
                as complete, cross off checklist items, and remove members.
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="w-[90%] flex max-lg:flex-col gap-4 mx-auto my-28">
        <div className="lg:w-1/2">
          <img
            src="https://images.ctfassets.net/rz1oowkt5gyp/6hNbA7zgdet54M6sOSili1/93976b007213362ef309f61ff00f484a/spot-illo-favorite_apps.svg"
            alt=""
          />
        </div>
        <div className="lg:w-1/2 lg:pl-24">
          <h1 className="text-4xl py-1 text-heading font-charlie-display-sm ">
            Integrate your favorite apps
          </h1>
          <div className="w-1/4 my-2 p-0.5 bg-linear-to-r from-[#41389A] to-[#4985EA] border-0 rounded"></div>
          <p className="text-lg font-charlie-text-r py-2">
            Setting rules means important tasks won’t fall through the cracks.
            Just set a trigger and the actions to be performed, and let Butler
            run the show. Doesn’t that rule?
          </p>
        </div>
      </div>
    </div>
  );
};

export default FunctionsInfo;
