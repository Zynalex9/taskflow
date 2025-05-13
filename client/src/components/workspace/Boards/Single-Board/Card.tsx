import { ICard } from "../../../../types/functionalites.types";
import { useLocation, useNavigate, useParams } from "react-router-dom";
interface IProps {
  card: ICard | undefined;
}
const Card: React.FC<IProps> = ({ card }) => {
  console.log("c", card);
  const location = useLocation();
  const navigate = useNavigate();
  const {workspaceId,boardId} = useParams()
  const background = location.state?.background;
  console.log(background);
  return (
    <>
      <div
        onClick={() => {
          navigate(
            `/user/w/workspace/${workspaceId}/board/${boardId}/${card?.name}`,
            {
              state: { background: location },
            }
          );
        }}
        className="bg-[#22272B] rounded-xl py-2 px-1 my-2 max-w-full transition-all duration-100 hover:border-white hover:border"
      >
        {card?.name}
      </div>
    </>
  );
};

export default Card;
