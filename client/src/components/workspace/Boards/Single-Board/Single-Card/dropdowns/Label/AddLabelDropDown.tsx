import { useEffect, useState } from "react";
import { Pencil } from "lucide-react";
import DropdownHeader from "../../DropdownHeader";
import { Checkbox } from "@/components/ui/checkbox";
import { useAddLabelsMutation } from "@/store/cardApi";
import { useParams } from "react-router-dom";

interface ILabel {
  color: string;
  name: string;
  _id: string;
}
interface ILabelWithChecked extends ILabel {
  isChecked: boolean;
}

const initialLabels: ILabelWithChecked[] = [
  { _id: "1", color: "#216C52", name: "", isChecked: false },
  { _id: "2", color: "#8E6E00", name: "", isChecked: false },
  { _id: "4", color: "#C9372C", name: "", isChecked: false },
  { _id: "5", color: "#5B3FBB", name: "", isChecked: false },
  { _id: "6", color: "#0079BF", name: "", isChecked: false },
  { _id: "7", color: "#055A8C", name: "", isChecked: false },
  { _id: "8", color: "#29CCE5", name: "", isChecked: false },
  { _id: "9", color: "#61BD4F", name: "", isChecked: false },
  { _id: "10", color: "#A6C5E2", name: "", isChecked: false },
];

const AddLabelDropdown = ({
  cardId,
  existingLabels,
}: {
  cardId: string;
  existingLabels: ILabel[];
}) => {
  const [labels, setLabels] = useState(initialLabels);
  const [selected, setSelected] = useState<string[]>(() => {
    const existingLabelColors = existingLabels.map((label) => label.color);
    return existingLabelColors;
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>("");
  const [addLabels] = useAddLabelsMutation();
  const toggleLabel = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };
  const { boardId } = useParams();
  const startEditing = (label: ILabel) => {
    setEditId(label._id);
    setEditText(label.name);
  };

  const saveEdit = (id: string) => {
    const updated = labels.map((label) =>
      label._id === id ? { ...label, name: editText } : label
    );
    setLabels(updated);
    setEditId(null);
    setEditText("");
  };

  const handleAddClick = async () => {
    const selectedLabels = labels.filter((label) =>
      selected.includes(label._id)
    );
    if (!boardId) {
      console.warn("boardId is missing. Cannot proceed with adding labels.");
      return;
    }
    const body = {
      cardId,
      boardId,
      labels: selectedLabels.map((label) => ({
        name: label.name || "",
        color: label.color,
      })),
    };

    try {
      await addLabels(body);
      console.log("Labels added successfully");
    } catch (error) {
      console.error("Error adding labels:", error);
    }
  };
  console.log("existingLabels", existingLabels);
  useEffect(() => {
    const selectedIds = existingLabels.map((label) => label._id);
    setSelected(selectedIds);

    const updated = initialLabels.map((label) => {
      const match = existingLabels.find((l) => l.color === label.color);
      return match ? { ...label, name: match.name, isChecked: true } : label;
    });

    setLabels(updated);
  }, [existingLabels]);
  return (
    <div className="absolute -top-20 left-2 w-80 h-96 rounded bg-[#282E33] p-4 shadow-2xl text-white z-30">
      <DropdownHeader headerText="Labels" />
      <div
        className="space-y-2 mt-3 overflow-y-auto custom-scrollbar"
        style={{ maxHeight: "calc(100% - 100px)" }}
      >
        {labels.map((label) => (
          <div key={label._id} className="flex items-center gap-2">
            <Checkbox
              checked={label.isChecked || selected.includes(label._id)}
              onCheckedChange={() => toggleLabel(label._id)}
              className="accent-blue-500"
            />
            <div
              className="flex-grow rounded p-2 flex   items-center justify-between h-10"
              style={{ backgroundColor: label.color }}
            >
              {editId === label._id ? (
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onBlur={() => saveEdit(label._id)}
                  onKeyDown={(e) => e.key === "Enter" && saveEdit(label._id)}
                  autoFocus
                  className="bg-transparent text-black rounded px-2 py-1 w-full text-sm"
                />
              ) : (
                <span className="text-sm font-semibold">
                  {label.name || ""}
                </span>
              )}
            </div>
            <button onClick={() => startEditing(label)}>
              <Pencil size={16} />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <button
          onClick={handleAddClick}
          className="bg-blue-600 hover:bg-blue-700 transition-colors text-white w-full py-2 rounded font-semibold"
        >
          Add Selected Labels
        </button>
      </div>
    </div>
  );
};

export default AddLabelDropdown;
