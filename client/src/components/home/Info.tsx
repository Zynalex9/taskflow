import { CalendarDaysIcon, EqualApproximatelyIcon } from "lucide-react";

const Info = () => {
  return (
    <div className="min-h-screen bg-primary w-full">
      <div className="text-white w-full text-center pt-12">
        <h1 className="text-3xl font-charlie-display-sm">
          From message to actions
        </h1>
        <p className="font-charlie-text-r text-lg pt-4 font-normal ">
          Quickly turn communication from your favorite apps into to-dos,
          keeping all <br /> your discussions and tasks organized in one place.
        </p>
      </div>
      <div className="bg-white p-8 rounded-xl w-[90%] m-auto flex gap-4 mt-10">
        <img
          src="/slack-to-inbox.webp"
          alt=""
          className="w-[60%] object-cover"
        />
        <div className="text-black font-charlie-text-r w-[40%] space-y-4 pt-10 px-4">
          <div className="flex gap-2 items-center ">
            <EqualApproximatelyIcon size={50} color="#8777D9" />
            <h1 className="text-4xl"> Email Magic</h1>
          </div>
          <div className="py-4">
            <span className="bg-[#DEEBFF] rounded-full text-center text-sm">
              coming soon
            </span>
            <p className="">
              Easily turn your emails into to-dos! Just forward them to your
              Trello Inbox, and they’ll be transformed by Atlassian Intelligence
              (AI) into organized to-dos with all the links you need.
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white p-8 rounded-xl w-[90%] m-auto flex gap-4 mt-20">
        <div className="text-black font-charlie-text-r w-[40%] space-y-4 pt-10 px-4 mt-10">
          <div className="flex gap-2 items-center ">
            <CalendarDaysIcon size={50} color="#8777D9" />
            <h1 className="text-3xl"> SLACK SORCERY</h1>
          </div>
          <div className="py-4">
            <span className="bg-[#DEEBFF] rounded-full text-center text-sm">
              coming soon
            </span>
            <p className="">
              Easily turn your emails into to-dos! Just forward them to your
              Trello Inbox, and they’ll be transformed by Atlassian Intelligence
              (AI) into organized to-dos with all the links you need.
            </p>
          </div>
        </div>
        <img
          src="/slack-to-inbox.webp"
          alt=""
          className="w-[60%] object-cover"
        />
      </div>
      <div className="two"></div>
    </div>
  );
};

export default Info;
