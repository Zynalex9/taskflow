import { Building2, CloudLightningIcon, Lightbulb, Star } from "lucide-react";
import ContentBox from "../reusables/ContentBox";

const Plans = () => {
  const contentData = [
    {
      Icon: Lightbulb,
      heading: "Standard",
      text: "For teams that need to manage more work and scale collaboration.",
      bg: "#FFFCF2",
    },
    {
      Icon: Star,
      heading: "Premium",
      text: "Best for teams up to 100 that need to track multiple projects and visualize work in a variety of ways.",
      bg: "#EEF5FF",
    },
    {
      Icon: Building2,
      heading: "Enterprise",
      text: "Everything your enterprise teams and admins need to manage projects.",
      bg: "#F2FDFF",
    },
  ];
  return (
    <div className="bg-white w-full px-4 lg:pl-20 shadow-2xl flex flex-col lg:flex-row gap-4 max-lg:pb-16">
      <div className="left-side lg:w-[75%] lg:py-10">
        <div className="mb-8 flex flex-col lg:flex-row gap-2 py-4">
          {contentData.map(({ Icon, text, bg, heading }, i) => (
            <ContentBox
              key={i}
              Icon={Icon}
              text={text}
              bg={bg}
              heading={heading}
              to="/"
            />
          ))}
        </div>
        <div className="bg-[#FFFDF5] p-8 flex items-center justify-between ">
          <div className="space-y-4">
            <div className="flex gap-2 ">
              <CloudLightningIcon color="orange" />
              <h1 className="text-xl"> Free Plan</h1>
            </div>
            <p className="text-xs text-gray-600">
              {" "}
              For individuals or small teams looking to keep work organize
            </p>
          </div>
          <button className="px-1.5 py-2 lg:p-4 bg-white border border-amber-600">
            Take a tour of Taskflow
          </button>
        </div>
      </div>
      <div className="right-side bg-[#F7F5FF]  max-lg:mx-auto w-[95%] lg:w-[25%] space-y-8 p-6">
        <div className="space-y-2">
          <h1 className="text-xl">Compare plans and Pricing</h1>
          <div className="border-b border-gray-200"></div>
        </div>
        <p className="text-xs text-gray-500">
          Whether you’re a team of 2 or 2,000, Taskflow’s flexible pricing model
          means you only pay for what you need.
        </p>
        <button className="bg-white px-2 py-4 border rounded">
          View Taskflow Pricing
        </button>
      </div>
    </div>
  );
};

export default Plans;
