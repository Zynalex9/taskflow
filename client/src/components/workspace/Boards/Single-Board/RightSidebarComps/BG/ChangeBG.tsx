import { useSingleBoardContext } from "@/Context/SingleBoardContext";

const ChangeBG = () => {
  const { board } = useSingleBoardContext();
  return (
    <div className="mt-4 flex items-center gap-4">
      <img src={board.cover} alt="" className="size-6 rounded" />
      <h2 className=" text-sm">Change Background</h2>
    </div>
  );
};

export default ChangeBG;
