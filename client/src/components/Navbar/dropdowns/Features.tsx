import { Link } from "react-router-dom";
import ContentBox from "../reusables/ContentBox";
import {
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
    bg: "#F1FDF7",
    to: "/feature/inbox",
  },
  {
    Icon: CalendarCheck,
    heading: "Planner",
    text: "Sync your calendar and allocate focused time slots to boost productivity.",
    bg: "#FFF5F2",
    to: "/feature/planner",
  },
  {
    Icon: Caravan,
    heading: "Automation",
    text: "Automate tasks and workflows with Butler automation.",
    bg: "#FFF8FD",
    to: "/feature/automation",
  },
  {
    Icon: PowerSquareIcon,
    heading: "Power-ups",
    text: "Power up your teams by linking their favorite tools with Taskflow plugins.",
    bg: "#FFFCF2",
    to: "/feature/power-ups/featured",
  },
  {
    Icon: Component,
    heading: "Integration",
    text: "Find the apps your team is already using or discover new ways to get work done in Taskflow.",
    bg: "#F2FDFF",
    to: "/feature/intregation",
  },
];
const NavBarFeatures = () => {
  return (
    <div className="bg-white shadow-2xl w-full lg:h-[70%] lg:px-4 flex  flex-col lg:flex-row transition-transform font-charlie-text-r">
      <div className="left w-full lg:w-[75%]">
        <div className="top pl-8 lg:px-24">
          <h3 className="text-lg lg:text-2xl lg:pt-6">
            Explore the features that help your team succeed
          </h3>
          <div className="border-b border-gray-200 w-full lg:mb-10"></div>
        </div>
        <div className="content flex flex-col lg:flex-row lg:flex-wrap pl-6 lg:pl-24 w-full pb-10 space-y-1 mt-4 lg:mt-0 lg:-space-y-0">
          {ContentBoxData.map((box, i) => (
            <ContentBox
              key={i}
              Icon={box.Icon}
              heading={box.heading}
              text={box.text}
              bg={box.bg}
              to={box.to}
            />
          ))}
        </div>
      </div>
      <div className="right lg:w-[25%] bg-[#F7F5FF] lg:px-4 w-[80%] max-lg:mx-auto max-lg:rounded max-lg:shadow-xl max-lg:px-4 max-lg:mb-20 max-lg:pb-4">
        <div className="top">
          <h3 className="text-2xl lg:text-start py-6">Meet Taskflow</h3>
          <div className="border-b border-gray-200 w-full"></div>
          <p className="py-6 text-sm w-[80%] leading-slug">
            Taskflow makes it easy for your team to get work done. No matter the
            project, workflow, or type of team, Taskflow can help keep things
            organized. It’s simple – sign-up, create a board, and you’re off!
            Productivity awaits
          </p>
          <Link to={"/user/sign-up"}>
            <button className="bg-white border border-black px-2 py-3 rounded hover:scale-105 cursor-pointer transition-transform">
              Check out Taskflow
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NavBarFeatures;
