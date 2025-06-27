import { useSingleBoardContext } from "@/Context/SingleBoardContext";

export const AboutPanel = () => {
  const { board } = useSingleBoardContext();
  console.log("AboutPanel", board);
  return <div>
    
  </div>;
};
