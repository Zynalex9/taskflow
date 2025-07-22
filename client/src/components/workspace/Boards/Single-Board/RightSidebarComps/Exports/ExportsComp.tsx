import { Share } from "lucide-react";
import jsPDF from "jspdf";
import axios from "axios";
import { ICard, IList } from "@/types/functionalites.types";

type ExportsCompProps = {
  boardId: string;
};

const ExportsComp = ({ boardId }: ExportsCompProps) => {
  const exportBoardAsPDF = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/board/full-details/${boardId}`,
        { withCredentials: true }
      );

      const board = data.data;

      const pdf = new jsPDF();
      pdf.text("Board Title: " + board.title, 10, 10);
      let y = 20;

      board.lists.forEach((list: IList) => {
        pdf.text(`List: ${list.name}`, 10, y);
        y += 10;
        list.cards.forEach((card: ICard) => {
          pdf.text(`- ${card.name}: ${card.description || ""}`, 15, y);
          y += 10;
        });
      });

      pdf.save(`${board.title}.pdf`);
    } catch (err) {
      console.error("Export PDF Error:", err);
    }
  };

  return (
    <div
      onClick={exportBoardAsPDF}
      className="mt-4 flex items-center gap-6 hover:bg-gray-700 p-1 rounded-md transition-colors duration-150 cursor-pointer"
    >
      <Share size={18} />
      <h2 className="">Print, Export and Share</h2>
    </div>
  );
};

export default ExportsComp;
