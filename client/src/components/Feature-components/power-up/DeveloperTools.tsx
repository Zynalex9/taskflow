import { developerCardData } from "../data/data"
import Card from "./Card"

const DeveloperTools = () => {
  return (
    <div className="flex items-center justify-center w-full gap-2 flex-wrap">
      {developerCardData.map(({ heading, logoImg, shortDescription, users, bannerImg }, index) => (
        <Card
          key={index}
          heading={heading}
          logoImg={logoImg}
          shortDescription={shortDescription}
          users={users}
          bannerImg={bannerImg}
        />
      ))}
    </div>
  )
}

export default DeveloperTools
