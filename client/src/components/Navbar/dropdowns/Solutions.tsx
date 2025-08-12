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
    heading: "Marketing Teams",
    text: "Capture every vital detail from emails, Slack, and more directly into your Taskflow Inbox.",
    bg: "#F1FDF7",
    to: "/solution/marketing-teams",
  },
  {
    Icon: CalendarCheck,
    heading: "Project Manager",
    text: "Sync your calendar and allocate focused time slots to boost productivity.",
    bg: "#FFF5F2",
    to: "/solution/project-manager",
  },
  {
    Icon: Caravan,
    heading: "Engineering Teams",
    text: "Automate tasks and workflows with Butler automation.",
    bg: "#FFF8FD",
    to: "/solution/engineering-teams",
  },
  {
    Icon: PowerSquareIcon,
    to: "/solution/startups",
    heading: "Startups",
    text: "Power up your teams by linking their favorite tools with Taskflow plugins.",
    bg: "#FFFCF2",
  },
  {
    Icon: BookTemplate,
    heading: "Design Teams",
    text: "Give your team a blueprint for success with easy-to-use templates from industry leaders and the Taskflow community.",
    bg: "#EEF5FF",
    to: "/solution/design-teams",
  },
  {
    Icon: Component,
    heading: "Remote Teams",
    to: "/solution/remote-teams",
    text: "Find the apps your team is already using or discover new ways to get work done in Taskflow.",
    bg: "#F2FDFF",
  },
];

const Solutions = () => {
  return (
    <div className="lg:shadow-2xl bg-white dark:bg-[#1D2125] w-full flex lg:flex-row flex-col h-[80%] font-charlie-text-r">
      <div className="left lg:w-[75%]">
        <div className="heading px-2 lg:pl-28 pt-4">
          <h2 className="text-xl text-text-primary dark:text-white leading-tight font-charlie-text-sb">
            Take a page out of these pre-built Taskflow playbooks designed for
            all teams
          </h2>
          <div className="border-b border-gray-200 w-[85%] mb-10 py-2"></div>
          <div className="">
            <div className="flex flex-wrap w-full gap-4 my-10">
              {ContentBoxData.map(({ heading, Icon, bg, text, to }, i) => (
                <ContentBox
                  key={i}
                  Icon={Icon}
                  heading={heading}
                  text={text}
                  bg={bg}
                  to={to}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="right max-lg:mx-auto max-lg:rounded w-[90%]  bg-[#F7F5FF] dark:bg-[#1D2125] lg:w-[25%] p-2">
        <div className="content px-2">
          <h1 className="font-charlie-text-r text-2xl">
            Our product in action
          </h1>
          <div className="border-b border-gray-200 w-full py-2 px-2"></div>
          <div className="text-content py-3 font-charlie-text-r">
            <div className="space-y-3 py-2">
              <h1 className="text-xl">Use case: Task management</h1>
              <p className="text-sm text-gray-600 ">
                Track progress of tasks in one convenient place with a visual
                layout that adds ‘ta-da’ to your to-do’s.
              </p>
            </div>
            <div className="space-y-3 py-2">
              <h1 className="text-xl">Use case: Resource hub</h1>
              <p className="text-sm  text-gray-600">
                Keep projects organized, deadlines on track, and teammates
                aligned with Trello.
              </p>
            </div>
            <div className="space-y-3 py-2">
              <h1 className="text-xl">Use case: Resource hub</h1>
              <p className="text-sm  text-gray-600">
                Save hours when you give teams a well-designed hub to find
                information easily and quickly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Solutions;
