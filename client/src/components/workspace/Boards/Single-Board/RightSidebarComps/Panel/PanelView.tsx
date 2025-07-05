import { ArrowLeft } from "lucide-react";
import { AboutPanel } from "./AboutPanel";
import { VisibilityPanel } from "./VisibilityPanel";

interface PanelViewProps {
  panel: string;
  goBack: () => void;
}
export const PanelView: React.FC<PanelViewProps> = ({ goBack, panel }) => {
  return (
    <div className="h-full">
      <button onClick={goBack} className="text-textP hover:text-gray-700">
        <ArrowLeft size={20} className="inline mr-2" />
        
      </button>
      <div className="flex-1 overflow-y-auto ">
        {panel === "about" && <AboutPanel />}
        {panel === "visibility" && <VisibilityPanel />}
      </div>
    </div>
  );
};
