import {  boardUtilitiesData } from "../data/data";
import Card from "./Card";

const BoardUtilities = () => {
  return (
    <div className="flex w-full gap-2 flex-wrap">
      {boardUtilitiesData.map(
        ({ heading, logoImg, shortDescription, users, bannerImg }, index) => (
          <Card
            key={index}
            heading={heading}
            logoImg={logoImg}
            shortDescription={shortDescription}
            users={users}
            bannerImg={bannerImg}
          />
        )
      )}
    </div>
  );
};

export default BoardUtilities;
