import { automationCardData, projectData } from "../data/data";
import Card from "./Card";

const ProjectManagement = () => {
    return (
        <div className="flex w-full gap-2 flex-wrap">
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
        </div>
      );
}

export default ProjectManagement
