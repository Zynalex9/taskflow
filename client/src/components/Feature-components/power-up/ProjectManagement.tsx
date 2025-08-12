import { ToastContainer } from "react-toastify";
import { projectData } from "../data/data";
import Card from "./Card";

const ProjectManagement = () => {
  return (
    <div className="flex items-center justify-center w-full gap-2 flex-wrap">
      {projectData.map(
        ({ heading, logoImg, shortDescription, users }, index) => (
          <Card
            key={index}
            heading={heading}
            logoImg={logoImg}
            shortDescription={shortDescription}
            users={users}
          />
        )
      )}
      <ToastContainer style={{ zIndex: 100000 }} />
    </div>
  );
};

export default ProjectManagement;
