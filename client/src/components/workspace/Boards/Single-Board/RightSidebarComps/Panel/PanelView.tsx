import { ArrowLeft } from "lucide-react";
import { AboutPanel } from "./AboutPanel";
import { ChangeBGStep1 } from "../BG/ChangeBGStep1";
import { MoreImages } from "../BG/MoreImages";
import { BGColors } from "../BG/BGColors";
import { SettingComp } from "../Settings/SettingComp";

interface PanelViewProps {
  panel: string;
  goBack: () => void;
  goToPanel: (panelName: string) => void;
}
export const PanelView: React.FC<PanelViewProps> = ({
  goBack,
  panel,
  goToPanel,
}) => {
  return (
    <div className="h-full">
      <button onClick={goBack} className="text-textP hover:text-gray-700">
        <ArrowLeft size={20} className="inline mr-2" />
      </button>
      <div className="flex-1 overflow-y-auto ">
        {panel === "about" && <AboutPanel />}
        {panel === "bg" && <ChangeBGStep1 goTo={goToPanel} />}
        {panel === "bg-images" && <MoreImages />}
        {panel === "bg-colors" && <BGColors />}
        {panel === "settings" && <SettingComp />}
      </div>
    </div>
  );
};
