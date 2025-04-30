import { Link } from "react-router-dom";
interface CaptureSection {
  heading: string;
  text: string;
  image: string;
}

interface IndexProps {
  page: string;
  itemName: string;
  hero: {
    heading: string;
    subheading: string;
    secondHeading?: string;
    buttonText: string;
    buttonLink?: string;
    linkText: string;
    linkTo: string;
    image: string;
  };
  captureHeader: {
    heading: string;
    text: string;
    image: string;
  };
  captureSections1: CaptureSection;
  captureSections2: CaptureSection;
  captureSections3: CaptureSection;
}

const Index: React.FC<IndexProps> = ({
  itemName,
  hero,
  captureHeader,
  captureSections1,
  captureSections2,
  captureSections3,
}) => {
  return (
    <div className="w-full bg-white">
      <div className=" bg-[#F4F5F7] min-h-[70vh] mb-30 w-full flex flex-col lg:flex-row lg:items-center lg:justify-center lg:p-12">
        <div className="max-lg:text-center max-lg:p-10 pl-10 w-full lg:w-[50%] text-heading font-charlie-text-r space-y-2">
          <h1 className=" text-5xl font-charlie-display-sm">{hero.heading}</h1>
          {hero.secondHeading && (
            <h1 className=" text-4xl font-charlie-display-sm">
              {hero.secondHeading}
            </h1>
          )}
          <h3 className="text-2xl">{hero.subheading}</h3>
          <button className="bg-white border border-cyan-300 rounded transition-all duration-200 cursor-pointer hover:bg-white/25 px-2 py-4">
            {hero.buttonText}
          </button>
          <Link to={hero.linkTo} className="text-primary hover:underline">
            <h3>{hero.linkText}</h3>
          </Link>
        </div>
        <div className="lg:w-[50%]">
          <img
            src={hero.image}
            alt=""
            className="pr-10 max-lg:pr-0 max-lg:mx-auto max-lg:w-[80%]"
          />
        </div>
      </div>
      <div className="w-[80%] mb-20 mx-auto text-center space-y-9">
        <h1 className="text-5xl font-charlie-display-sm ">
          {captureHeader.heading}
        </h1>
        <p className="font-charlie-text-r text-xl lg:mx-auto lg:w-[800px]">
          {captureHeader.text}
        </p>
        {captureHeader.image && (
          <img
            src={captureHeader.image}
            alt=""
            className="mx-auto max-lg:w-[300px] w-full max-w-[800px] object-contain"
          />
        )}
      </div>
      <div className="w-full flex max-lg:flex-col-reverse gap-6 p-8 lg:mb-20 lg:px-30">
        <div className="lg:w-1/2 flex flex-col justify-center gap-6 pt-6">
          <h1 className="text-4xl font-charlie-display-sm">
            {captureSections1.heading}
          </h1>
          <p className="text-xl font-charlie-text-r lg:w-[400px]">
            {captureSections1.text}
          </p>
        </div>
        <div className="w-full lg:w-1/2 flex justify-center">
          <img
            src={captureSections1.image}
            className="w-full max-w-[500px] object-contain"
          />
        </div>
      </div>
      <div className="w-full flex max-lg:flex-col-reverse lg:flex-row-reverse gap-6 p-8 lg:mb-20 lg:px-[30px]">
        <div className="lg:w-1/2 flex flex-col justify-center gap-6 pt-6">
          <h1 className="text-4xl font-charlie-display-sm">
            {captureSections2.heading}
          </h1>
          <p className="text-xl font-charlie-text-r lg:w-[400px]">
            {captureSections2.text}
          </p>
        </div>
        <div className="w-full lg:w-1/2 flex justify-center">
          <img
            src={captureSections2.image}
            alt=""
            className="w-full max-w-[500px] object-contain"
          />
        </div>
      </div>
      <div className="w-full flex max-lg:flex-col-reverse gap-6 p-8 lg:mb-20 lg:px-30">
        <div className="lg:w-1/2 flex flex-col justify-center gap-6 pt-6">
          <h1 className="text-4xl font-charlie-display-sm">
            {captureSections3.heading}
          </h1>
          <p className="text-xl font-charlie-text-r lg:w-[400px]">
            {captureSections3.text}
          </p>
        </div>
        <div className="w-full lg:w-1/2 flex justify-center">
          <img
            src={captureSections3.image}
            alt=""
            className="w-full max-w-[500px] object-contain"
          />
        </div>
      </div>
      <div className="w-full bg-primary p-24 space-y-3 text-center text-white">
        <h1 className="text-3xl font-charlie-display-sm">
          Join the Taskflow {itemName} revolution!
        </h1>
        <p className="text-xl font-charlie-text-r">
          We’re excited to introduce Taskflow {itemName}, and we want your
          feedback to make it even better! Try it out, share your thoughts, and
          help us shape the future of planning.
        </p>
        <button className="bg-white shadow-xl px-3 py-4  mt-3 rounded text-black">
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Index;
