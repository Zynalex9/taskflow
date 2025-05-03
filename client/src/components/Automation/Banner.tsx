import { Link } from "react-router-dom";
import Button from "../resuable/Button";

const Banner = () => {
  return (
    <div className="w-full lg:h-[90vh] bg-linear-to-r from-[#41389A] to-[#4985EA] flex max-lg:flex-col-reverse gap-8 lg:gap-4 max-lg:text-center py-8 px-4 lg:p-24">
      <div className="lg:w-1/2 space-y-4">
        <h1 className="text-white text-5xl font-charlie-display-sm">
          Automate your workflow with Butler
        </h1>
        <p className="text-white text-xl font-charlie-text-sb">
          Powerful no-code automation is built into every Trello board. With
          Butler, you can focus on the work that matters most and let the robots
          do the rest.
        </p>
        <p className="text-lg font-charlie-text-sb text-white">
          Start automating today — It’s free!
        </p>
        <Button buttonText="Try Buttler" />
        <Link to={"/plans"}>
          <p className="text-md text-white/65 underline cursor-pointer">Learn more about Taskflow's plans and pricing.</p>
        </Link>
      </div>
      <div className="lg:w-1/2">
        <img
          src="https://images.ctfassets.net/rz1oowkt5gyp/5VdMUyyLbdnF4kqGM5aORJ/646505ec4e9d9f91b9dc2b88198d5866/butler-header.svg"
          alt=""
        />
      </div>
    </div>
  );
};

export default Banner;
