import FunctionsInfo from "./FunctionsInfo";

const Functions = () => {
  return (
    <div className="lg:min-h-screen py-20 px-4 bg-[#E5EFFF] ">
      <div className="text-center space-y-8">
        <h3 className="text-center text-heading font-charlie-display-sm lg:text-4xl">
          Create rules, buttons, and commands to <br /> automate almost any
          action in Trello.
        </h3>
        <img
          src="https://images.ctfassets.net/rz1oowkt5gyp/Wn1UM6FwcYkNYZHPzFDkX/11e151e55b277e5690c5b1742cd486a0/Illo-Flowchart.svg"
          alt=""
          className="w-[90%] mx-auto"
        />
      </div>
      <div>
        <FunctionsInfo/>
      </div>
    </div>
  );
};

export default Functions;
