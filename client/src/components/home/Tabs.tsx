import { useState } from "react";

interface IData {
  image: string;
  heading: string;
  description: string;
}
const Tabs = () => {
  const sectionData: IData[] = [
    {
      image: "/inbox-slider.webp",
      heading: "Inbox",
      description:
        "When it’s on your mind, it goes in your Inbox. Capture your to-dos from anywhere, anytime.",
    },
    {
      image: "/board-slider.webp",
      heading: "Boards",
      description:
        'Your to-do list may be long, but it can be manageable! Keep tabs on everything from "to-dos to tackle" to "mission accomplished!”',
    },
    {
      image: "/planner-slider.webp",
      heading: "Planner",
      description:
        "Planner Drag, drop, get it done. Snap your top tasks into your calendar and make time for what truly matters.",
    },
  ];
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  console.log();
  return (
    <div>
      <div className="top-sec font-charlie-text-r text-heading px-10 space-y-4">
        <h3 className="text-xl font-charlie-display-sm pt-10">TASKFLOW 101</h3>
        <h1 className="font-charlie-display-sm text-5xl">
          Your productivity powerhouse
        </h1>
        <p className="max-w-3xl text-xl">
          Stay organized and efficient with Inbox, Boards, and Planner. Every
          to-do, idea, or responsibility—no matter how small—finds its place,
          keeping you at the top of your game.
        </p>
      </div>
      <div className="slider-div w-full flex gap-10 p-10">
        <div className="left w-1/3 space-y-8">
          {sectionData.map(({ description, heading }, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedIdx(idx)}
              className={`font-charlie-text-r rounded-2xl transition-all duration-100 p-4 ${
                selectedIdx === idx
                  ? "shadow-2xl border-l-8 border-[#00C7E5]"
                  : ""
              }`}
            >
              <div>
                <h1 className="text-xl font-charlie-display-sm">{heading}</h1>
                <p className="text-md py-4">{description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="right w-[75%] rounded-lg p-4">
          <img src={sectionData[selectedIdx].image} alt="" className="object-contain" />
        </div>
      </div>
    </div>
  );
};

export default Tabs;
