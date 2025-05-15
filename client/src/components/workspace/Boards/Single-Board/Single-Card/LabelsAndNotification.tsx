import { useSelector } from "react-redux";
import { RootState } from "../../../../../store/store";
import { Plus, Eye } from "lucide-react";

const LabelsAndNotification = () => {
  const { card } = useSelector((state: RootState) => state.card);

  if (!card) return null;

  return (
    <div className="w-full ml-10 font-charlie-text-sb">
      <div className="flex  mb-2">
        {card.labels.length > 0 && (
          <h2 className="text-md text-textP">Labels</h2>
        )}
        {card.members.length > 0 && (
          <h2 className="text-md text-textP pl-48">Members</h2>
        )}
        <h2 className="text-md text-textP pl-6">Notifications</h2>
      </div>

      <div className="flex gap-4">
        <div className="flex gap-1 flex-wrap">
          {card.labels.length > 0 &&
            card.labels.map((label) => (
              <div
                key={label._id}
                className={`rounded cursor-pointer ${
                  label.name ? "px-3 py-2 max-w-24" : "w-6 h-6"
                }`}
                style={{
                  backgroundColor: label.color,
                  transition: "background-color 0.3s ease-in-out",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${label.color}33`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = label.color;
                }}
              >
                {label.name && (
                  <span className="text-white text-sm truncate block">
                    {label.name}
                  </span>
                )}
              </div>
            ))}

          {card.labels.length > 0 && (
            <button className="bg-[#B6C2CF]/20 transition-colors duration-150 hover:bg-[#B6C2CF]/10 p-2 rounded cursor-pointer  ">
              <Plus size={16} className="cursor-pointer" />
            </button>
          )}
        </div>
        <div className="flex gap-1 flex-wrap">
          {card.members.length > 0 &&
            card.members.map((member) => (
              <div
                key={member._id}
                className={`rounded shadow-xl cursor-pointer w-8 h-8`}
                style={{
                  backgroundImage: `url(${member.profilePicture})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center center",
                }}
              >
            
              </div>
            ))}

          {card.members.length > 0 && (
            <button className="bg-[#B6C2CF]/20 transition-colors duration-150 hover:bg-[#B6C2CF]/10 p-2 rounded cursor-pointer  ">
              <Plus size={16} className="cursor-pointer" />
            </button>
          )}
        </div>

        <div>
          <button className="flex items-center gap-1 bg-[#B6C2CF]/20 transition-colors duration-150 hover:bg-[#B6C2CF]/10 px-3 py-2 rounded cursor-pointer">
            <Eye size={16} />
            <span className="text-sm text-white">Watch</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LabelsAndNotification;
