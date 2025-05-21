import { PageData } from "@/routes/data";
import Tabs from "../home/Tabs";
import Button from "../resuable/Button";

const SolutionTemplate: React.FC<PageData> = ({
  captureHeader,
  captureSections1,
  captureSections2,
  captureSections3,
  hero,
}) => {
  console.log("I WORKED");
  return (
    <div>
      <div className="w-full h-[80vh] bg-gradient-to-br from-[#0070F9] to-[#00B6D9] text-white flex flex-col items-center justify-center px-6 text-center gap-6 font-charlie-text-r">
       
        <h1 className="text-4xl lg:text-5xl font-bold max-w-3xl font-charlie-display-sm">
          {hero.heading}
        </h1>
        <p className="max-w-2xl text-lg text-white/90">
          Bring high-quality products to market faster with Taskflow. Discover
          the most effective ways product management teams can track product
          roadmaps, simplify sprints, and launch new updates with ease.
        </p>
        <button className="mt-4 px-6 py-3 bg-white text-[#0070F9] font-semibold rounded-full shadow-md hover:bg-white/90 transition">
          {hero.buttonText}
        </button>
      </div>
      <div className="flex max-lg:flex-col lg:gap-10 w-full px-12 py-20">
        <img
          src="https://images.ctfassets.net/rz1oowkt5gyp/36PnpdmXvcwbAeIrYlONqB/41927205eb9a3cdcfb08320bc95dd806/Card4_2x.png?w=704&fm=webp"
          alt="logo"
          className="lg:w-[35%] rounded"
        />
        <div className="pt-16 font-charlie-text-r text-2xl">
          <p>{captureHeader.text}</p>
          <button className="mt-4 px-6 py-3 bg-white text-[#0070F9] font-semibold rounded-full shadow-md hover:bg-white/90 transition">
            Learn More
          </button>
        </div>
      </div>
      <div className="bg-[#F4F5F7] flex flex-col items-center justify-center py-20 space-y-3">
        <p className="font-charlie-text-r text-heading text-2xl">
          Join over 2,000,000 teams worldwide who are using Taskflow to get more
          done.
        </p>
        <div className="flex">
          <img
            src="https://images.ctfassets.net/rz1oowkt5gyp/7nR3kQlx8IP5mfCCBTatsy/0b3952a6be3ebb10116d62aa93be7bbb/coinbase.svg"
            alt=""
          />
          <img
            src="https://images.ctfassets.net/rz1oowkt5gyp/6VwRn7PI4zrZo84Uoa8rnt/b0ae3da34916a3ff02d26e2120efe9b8/johnDeere.svg"
            alt=""
          />
          <img
            src="https://images.ctfassets.net/rz1oowkt5gyp/5KdQPApAFJpLMv9AntiNLk/530cef2a4b56ad758c1e91fad5c3e7ac/Grand-Hyatt.svg"
            alt=""
          />
        </div>
        <div className="flex w-[100%] items-center justify-center">
          <img
            src="https://images.ctfassets.net/rz1oowkt5gyp/1zdBcYqeqkDsLUfggfKFRO/a732e0001ca5153ef7195eea63ff6a3b/Visa.svg"
            alt=""
          />
          <img
            src="https://images.ctfassets.net/rz1oowkt5gyp/2Im844Kon73pvCD2ljoxeL/4073e041eb8eb961a0f9505965dec09b/Zoom.png?w=324&fm=webp"
            alt=""
            className="w-[15%]"
          />
        </div>
      </div>
      <div className="bg-gradient-to-b from-[#fff] to-[#E9FCFF]">
        <Tabs />
      </div>
      <div className="flex flex-col lg:flex-row-reverse gap-10 w-full px-12 py-10">
        <img
          src={captureSections1.image}
          alt="logo"
          className="lg:w-[55%] rounded"
        />
        <div className="pt-16 font-charlie-text-r text-xl space-y-4">
          <h2 className="text-heading font-charlie-display-sm text-4xl">
            {captureSections1.heading}
          </h2>
          <p>{captureSections1.text}</p>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-10 w-full px-12 py-5">
        <img
          src={captureSections2.image}
          alt="logo"
          className="lg:w-[55%] rounded"
        />
        <div className="pt-16 font-charlie-text-r text-xl space-y-4">
          <h2 className="text-heading font-charlie-display-sm text-4xl">
            {captureSections2.heading}
          </h2>
          <p>{captureSections2.text}</p>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row-reverse gap-10 w-full px-12 py-5">
        <img
          src={captureSections3.image}
          alt="logo"
          className="lg:w-[55%] rounded"
        />
        <div className="pt-16 font-charlie-text-r text-xl space-y-4">
          <h2 className="text-heading font-charlie-display-sm text-4xl">
            {captureSections3.heading}
          </h2>
          <p>{captureSections3.text}</p>
        </div>
      </div>
      <div className="bg-[#EAE6FF] pb-20">
        <h1 className="pt-20 pb-10 text-4xl font-charlie-display-sm text-center">
          Resources To Back Better Products
        </h1>
        <div className="border-b border-gray-400/60 py-4 w-[90%] mx-auto text-heading space-y-4">
          <h3 className="text-xl font-charlie-display-sm">
            How To Plan And Prioritize Your Product Roadmap In Taskflow [Blog
            Post]
          </h3>
          <p className="font-charlie-text-r">
            Get ahead of your competition by prioritizing and planning your
            product roadmap in Taskflow. Doing so will ensure your team builds
            the features that matter most, and ultimately enable you to achieve
            product excellence.
          </p>
          <h3 className="text-primary font-charlie-text-r underline">
            Read More
          </h3>
        </div>
        <div className="border-b border-gray-400/60 py-4 w-[90%] mx-auto text-heading space-y-4">
          <h3 className="text-xl font-charlie-display-sm">
            How To Plan And Prioritize Your Product Roadmap In Taskflow [Blog
            Post]
          </h3>
          <p className="font-charlie-text-r">
            Get ahead of your competition by prioritizing and planning your
            product roadmap in Taskflow. Doing so will ensure your team builds
            the features that matter most, and ultimately enable you to achieve
            product excellence.
          </p>
          <h3 className="text-primary font-charlie-text-r underline">
            Read More
          </h3>
        </div>
        <div className="border-b border-gray-400/60 py-4 w-[90%] mx-auto text-heading space-y-4">
          <h3 className="text-xl font-charlie-display-sm">
            How To Plan And Prioritize Your Product Roadmap In Taskflow [Blog
            Post]
          </h3>
          <p className="font-charlie-text-r">
            Get ahead of your competition by prioritizing and planning your
            product roadmap in Taskflow. Doing so will ensure your team builds
            the features that matter most, and ultimately enable you to achieve
            product excellence.
          </p>
          <h3 className="text-primary font-charlie-text-r underline">
            Read More
          </h3>
        </div>
        <div className=" mt-10 bg-gradient-to-r from-[#182B4E] to-[#403294] w-[90%] mx-auto rounded-md text-white font-charlie-display-sm flex items-center justify-between px-12 py-10">
          <div className="">
            <h2 className="text-lg">NOW AVAILABLE</h2>
            <h1 className="text-xl">A 14 Day Free Trial of Premium!</h1>
            <p className="text-md font-charlie-text-r">
              Get unlimited boards, Trello views, and limitless automation, plus
              a ton more.
            </p>
          </div>
          <Button buttonText="Get Started Today" />
        </div>
      </div>
    </div>
  );
};

export default SolutionTemplate;
