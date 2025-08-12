import { ToastContainer } from "react-toastify";
import { automationCardData } from "../data/data";
import Card from "./Card";

const Automation = () => {
  return (
    <div className="flex items-center justify-center w-full gap-2 flex-wrap">
      {automationCardData.map(
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
      <ToastContainer style={{ zIndex: 100000 }} />
    </div>
  );
};

export default Automation;
