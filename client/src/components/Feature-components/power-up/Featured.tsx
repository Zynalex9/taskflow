import { ToastContainer } from "react-toastify";
import { featuredCardData } from "../data/data";
import Card from "./Card";

const Featured = () => {
  return (
    <>
      <div
        className="w-full min-h-[50vh]  flex gap-5 flex-col items-center justify-center text-center bg-contain bg-center mb-20 "
        style={{
          backgroundImage:
            "url('https://trello.com/assets/260b9c5f78bd43739ef9.png')",
        }}
      >
        <h1 className="font-charlie-display-sm text-5xl">
          {" "}
          Power-ups for Taskflow
        </h1>
        <p className="lg:text-lg">
          Calendars, Voting, Repeating Cards and so much more with integrations
          like Jira, Slack, Google Drive, InVision - get your Trello superpowers
          now!
        </p>
      </div>
      <div
        className="flex items-center justify-center w-full gap-2 
      flex-wrap"
      >
        {featuredCardData.map(
          ({ bannerImg, heading, logoImg, shortDescription, users }, index) => (
            <Card
              key={index}
              bannerImg={bannerImg}
              heading={heading}
              logoImg={logoImg}
              shortDescription={shortDescription}
              users={users}
            />
          )
        )}
      </div>
      <ToastContainer style={{ zIndex: 100000 }} />
    </>
  );
};

export default Featured;
