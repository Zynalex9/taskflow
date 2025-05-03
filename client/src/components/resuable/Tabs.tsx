import { ArrowLeft, ArrowRight } from "lucide-react";
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
  const [currentIdx, setCurrentidx] = useState<number>(0);

  const prevSlide = () => {
    setCurrentidx((prev) =>
      prev === 0 ? sectionData.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setCurrentidx((prev) =>
      prev === sectionData.length - 1 ? 0 : prev + 1
    );
  };
  return (
    <div>
      <div className="slider-div w-full flex gap-10 p-10 max-lg:hidden">
        <div className="left w-1/3 space-y-8">
          {sectionData.map(({ description, heading }, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedIdx(idx)}
              className={`font-charlie-text-r rounded-2xl transition-all duration-200 cursor-pointer p-4 ${
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
          <img
            src={sectionData[selectedIdx].image}
            alt=""
            className="object-contain"
          />
        </div>
      </div>

      <div className="my-20 w-full mx-4 lg:hidden relative min-h-[500px]">
        {sectionData.map((data, idx) => (
          <div
            key={idx}
            className={`absolute top-0 left-0 w-full transition-opacity duration-700 ease-in-out ${
              idx === currentIdx
                ? "opacity-100 z-10"
                : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            <div className="img">
              <img
                src={data.image}
                alt=""
                className="size-[95%] mx-auto shadow-xl"
              />
            </div>
            <div className="p-4 space-y-5 font-charlie-text-r bg-white shadow-2xl w-[95%] mx-auto my-2 rounded-2xl min-h-[200px]">
              <h1 className="text-3xl">{data.heading}</h1>
              <p className="text-md mb-10">{data.description}</p>
            </div>
          </div>
        ))}

        <div className="w-full flex items-center justify-center absolute -bottom-8 left-0 pb-4 z-20">
          <ArrowLeft onClick={prevSlide} className="mx-3 cursor-pointer" />
          <ArrowRight onClick={nextSlide} className="mx-3 cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default Tabs;
