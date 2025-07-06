import { useSingleBoardContext } from "@/Context/SingleBoardContext";
import { isImageUrl } from "@/utils/helper";

const ChangeBG = () => {
  const { board } = useSingleBoardContext();
  return (
    <div className="mt-4 flex items-center gap-4">
      {isImageUrl(board.cover) ? (
        <img src={board.cover} alt="" className="size-6 rounded" />
      ) : (
        <div style={{ background: board.cover }} className="size-6 rounded"></div>
      )}
      <h2 className=" text-sm">Change Background</h2>
    </div>
  );
};

export default ChangeBG;
