import {
  ArrowLeftIcon,
  ArrowRightIcon,
  IdCard,
  LucideIcon,
  Puzzle,
  SettingsIcon,
} from "lucide-react";
import { useState } from "react";
import Card from "./Card";
interface IData {
  content: string;
  name: string;
  designation: string;
  sideText: string;
  logo: string;
}
interface IProps {
  Icon: LucideIcon;
  heading: string;
  buttonText?: string;
  description: string;
}
const Slider = () => {
  const data: IData[] = [
    {
      content:
        "We used Taskflow to provide clarity on steps, requirements, and procedures. This was exceptional when communicating with teams that had deep cultural and language differences.",
      name: "Jefferson Scomacao",
      designation: "Development Manager at IKEA/PTC",
      sideText:
        "74% of customers say Taskflow has improved communication with their co-workers and teams.",
      logo: "https://images.ctfassets.net/rz1oowkt5gyp/3X64fxSs4ek9A0ex45BUNI/911daed79127cb2f8a021da93fb68b9f/ptc-logo.svg",
    },
    {
      content:
        "Whether someone is in the office, working from home, or working on-site with a client, everyone can share context and information through Taskflow.",
      name: "Sumeet Moghe",
      designation: "Product Manager at ThoughtWorks",
      sideText: "81% of customers chose Taskflow for its ease of use.",
      logo: "https://images.ctfassets.net/rz1oowkt5gyp/2kIh1cWqsxjtHwWHWJJPsJ/d8436f3979be6cab7931f4d276c2d5ce/thoughtworks.svg",
    },
    {
      content:
        "[Taskflow is] great for simplifying complex processes. As a manager, I can chunk [processes] down into bite-sized pieces for my team and then delegate that out, but still keep a bird's-eye view.",
      name: "Joey Rosenberg",
      designation: "Global Leadership Director at Women Who Code",
      sideText:
        "75% of organizations report that Taskflow delivers value to their business within 30 days.",
      logo: "https://images.ctfassets.net/rz1oowkt5gyp/2f3keSvy7vtldV4YDFKkE2/5ed788fb5257c342995d25ba8e8e313d/WomenWhoCode_logo.svg",
    },
  ];

  const cardData: IProps[] = [
    {
      Icon: Puzzle,
      heading: "Intregations",
      description:
        "Connect the apps your team already uses into your Trello workflow or add a Power-Up to fine-tune your specific needs.",
      buttonText: "Browse Intregations",
    },
    {
      Icon: SettingsIcon,
      heading: "Butler Automation",
      description:
        "No-code automation is built into every Trello board. Focus on the work that matters most and let the robots do the rest.",
      buttonText: "Browse Intregations",
    },
    {
      Icon: IdCard,
      heading: "Card Monitoring",
      description:"View your to-dos from different boards in more than one place. Mirror a card to keep track of work wherever you need it!",
      buttonText:"Try it out"
    },
  ];
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev === data.length - 1 ? 0 : prev + 1));
  };
  const prevSlide = () => {
    setCurrentSlideIndex((prev) =>
      prev === 0 ? (prev = data.length - 1) : prev - 1
    );
  };
  console.log(currentSlideIndex);
  return (
    <div className="my-20 w-[100%] ">
      <div className="space-y-3 pl-32 my-10">
        <h2 className="font-charlie-display-sm text-2xl">WORK SMARTER</h2>
        <h1 className="font-charlie-display-sm text-4xl">
          Do more with Taskflow
        </h1>
        <p className="text-xl w-2xl font-charlie-text-r">
          Customize the way you organize with easy integrations, automation, and
          mirroring of your to-dos across multiple locations.
        </p>
      </div>
      <div className="w-full flex gap-5 my-20 px-32">
        {cardData.map(({ Icon, description, heading, buttonText }) => (
          <Card
            Icon={Icon}
            description={description}
            heading={heading}
            buttonText={buttonText}
          />
        ))}
      </div>
      <div className="controls px-6 w-[80%] mx-32 flex justify-end">
        <div>
          <button onClick={prevSlide}>
            <ArrowLeftIcon />
          </button>
          <button onClick={nextSlide}>
            <ArrowRightIcon />
          </button>
        </div>
      </div>
      {data.map(({ content, name, designation, sideText, logo }, idx) => (
        <div
          className={`w-[80%] m-auto flex  shadow-2xl shadow-black rounded-xl opacity-95 transition-opacity duration-200 ease-in ${
            idx === currentSlideIndex ? "block opacity-100" : "hidden opacity-0"
          }`}
        >
          <div className="left-side w-[65%] p-6">
            <div className="mb-40">
              <h3 className="text-2xl text-heading font-charlie-text-r">
                {content}
              </h3>
            </div>
            <div className="border-b-[1.5px] w-[20%]  pb-4"></div>
            <div className="designation font-charlie-text-r space-y-0.5 mt-4 text-xl">
              <h3>{name}</h3>
              <p>{designation}</p>
            </div>
            <div className="footer pt-4 w-full flex items-center justify-between text-xl">
              <img src={logo} alt="" />
              <button className="text-primary hover:underline">
                Read More
              </button>
            </div>
          </div>
          <div className="right-side w-[35%] bg-[#0747A6] text-4xl font-charlie-text-r text-white p-4 rounded-r-xl ">
            <h1 className="w-xs"> {sideText}</h1>{" "}
          </div>
        </div>
      ))}
    </div>
  );
};
export default Slider;
