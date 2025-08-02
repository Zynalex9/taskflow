import { useParams } from "react-router-dom";
import List from "./List";
import BoardHeader from "./BoardHeader";
import { isImageUrl } from "../../../../utils/helper";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetSingleBoardQuery } from "@/store/myApi";
import { SingleBoardContext } from "@/Context/SingleBoardContext";

const Board = () => {
  const { boardId } = useParams();
  const { data, isLoading } = useGetSingleBoardQuery(boardId ?? "", {
    skip: !boardId,
  });
  const cover = data?.data?.cover;
  const backgroundStyle = cover
    ? isImageUrl(cover)
      ? {
          backgroundImage: `url(${cover})`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
        }
      : { background: cover }
    : {};
  if (data)
    return (
      <SingleBoardContext.Provider value={{ board: data.data }}>
        <div
          className="w-full h-[89.8vh] "
          style={cover ? backgroundStyle : {}}
        >
          <BoardHeader
            title={data?.data.title}
            favourite={data?.data.favourite}
            boardId={data.data._id}
          />

<div className="p-8 w-full min-h-[79vh] overflow-x-auto overflow-y-hidden custom-scrollbar">
            {isLoading ? (
              <div className="flex gap-4 w-max min-w-full mt-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-[#101204] w-[300px] p-4 text-textP rounded-xl shadow-lg shadow-black/80 flex-shrink-0"
                  >
                    <Skeleton className="h-6 w-3/4 mb-4" />
                    {[...Array(2)].map((__, j) => (
                      <Skeleton
                        key={j}
                        className="h-10 w-full rounded-lg mb-2"
                      />
                    ))}
                    <Skeleton className="h-10 w-full mt-4" />
                  </div>
                ))}
              </div>
            ) : (
              <List list={data?.data.lists} />
            )}
          </div>
        </div>
      </SingleBoardContext.Provider>
    )};

export default Board;
