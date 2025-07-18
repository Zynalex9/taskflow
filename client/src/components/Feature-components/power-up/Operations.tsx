import { OperationsData } from "../data/data";
import Card from "./Card";

const Operations = () => {
  return (
    <div className="flex items-center justify-center w-full gap-2 flex-wrap">
      {OperationsData.map(
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

export default Operations;
