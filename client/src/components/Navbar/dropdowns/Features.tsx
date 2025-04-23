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
    text: "Capture every vital detail from emails, Slack, and more directly into your Trello Inbox.",
  },
  {
    Icon: CalendarCheck,
    heading: "Planner",
    text: "Sync your calendar and allocate focused time slots to boost productivity.",
  },
  {
    Icon: Caravan,
    heading: "Automation",
    text: "Automate tasks and workflows with Butler automation.",
  },
  {
    Icon: PowerSquareIcon,
    heading: "Power-ups",
    text: "Power up your teams by linking their favorite tools with Trello plugins.",
  },
  {
    Icon: BookTemplate,
    heading: "Templates",
    text: "Give your team a blueprint for success with easy-to-use templates from industry leaders and the Trello community.",
  },
  {
    Icon: Component,
    heading: "Integration",
    text: "Find the apps your team is already using or discover new ways to get work done in Trello.",
  },
];
const NavBarFeatures = () => {
  return (
    <div className="main absolute top-16 left-0 bg-gray-200 w-full h-[70%] px-4 flex transition-transform">
      <div className="left w-[90%]">
        <div className="top px-24">
          <h3 className="text-2xl py-6">
            Explore the features that help your team succeed
          </h3>
          <div className="border-b border-gray-400 w-full"></div>
        </div>
        <div className="content flex flex-wrap">
          {ContentBoxData.map((box) => (
            <ContentBox Icon={box.Icon} heading={box.heading} text={box.text} />
          ))}
        </div>
      </div>
      <div className="right w-[30%]"></div>
    </div>
  );
};

export default NavBarFeatures;
