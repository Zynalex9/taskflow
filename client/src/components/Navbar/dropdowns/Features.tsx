import React from "react";
import ContentBox from "../reusables/ContentBox";
import {
  BookTemplate,
  CalendarCheck,
  Caravan,
  Component,
  Inbox,
  PowerSquareIcon,
} from "lucide-react";
const ContentBoxData = [
  {
    Icon: Inbox,
    heading: "Inbox",
    text: "Capture every vital detail from emails, Slack, and more directly into your Taskflow Inbox.",
    bg:"#F1FDF7"
  },
  {
    Icon: CalendarCheck,
    heading: "Planner",
    text: "Sync your calendar and allocate focused time slots to boost productivity.",
    bg:'#FFF5F2'
  },
  {
    Icon: Caravan,
    heading: "Automation",
    text: "Automate tasks and workflows with Butler automation.",
    bg:"#FFF8FD"
  },
  {
    Icon: PowerSquareIcon,
    heading: "Power-ups",
    text: "Power up your teams by linking their favorite tools with Taskflow plugins.",
    bg:"#FFFCF2"
  },
  {
    Icon: BookTemplate,
    heading: "Templates",
    text: "Give your team a blueprint for success with easy-to-use templates from industry leaders and the Taskflow community.",
    bg:"#EEF5FF"
  },
  {
    Icon: Component,
    heading: "Integration",
    text: "Find the apps your team is already using or discover new ways to get work done in Taskflow.",
    bg:"#F2FDFF"
  },
];
const NavBarFeatures = () => {
  return (
    <div className="z-[999]  absolute top-16 left-0  w-full h-[70%] px-4 flex transition-transform font-charlie-text-r">
      <div className="left w-[80%]">
        <div className="top px-24">
          <h3 className="text-2xl pt-6">
            Explore the features that help your team succeed
          </h3>
          <div className="border-b border-gray-200 w-full py-2 mb-10"></div>
        </div>
        <div className="content flex flex-wrap pl-24 w-full">
          {ContentBoxData.map((box) => (
            <ContentBox Icon={box.Icon} heading={box.heading} text={box.text} bg={box.bg} />
          ))}
        </div>
      </div>
      <div className="right w-[25%] bg-red-500 px-5">
        <div className="top">
          <h3 className="text-2xl py-6">Meet Taskflow</h3>
          <div className="border-b border-gray-200 w-full"></div>
          <p className="py-6 text-sm w-[80%]">
            Taskflow makes it easy for your team to get work done. No matter the
            project, workflow, or type of team, Taskflow can help keep things
            organized. It’s simple – sign-up, create a board, and you’re off!
            Productivity awaits
          </p>
          <button className="bg-white border border-black px-2 py-4 rounded hover:scale-105 cursor-pointer transition-transform">
            Check out Taskflow
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavBarFeatures;
