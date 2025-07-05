import CustomBorder from "@/components/resuable/CustomBorder";
import { Plus } from "lucide-react";

export const ChangeBGStep1 = ({ goTo }: { goTo: (param: string) => void }) => {
  return (
    <div>
      <div className="flex items-center w-full justify-center gap-4 px-2 py-1 rounded-lg shadow-md">
        <div
          className="flex flex-col items-center gap-2"
          onClick={() => goTo("bg-images")}
        >
          <div
            className="h-32 w-32 rounded-lg shadow-md"
            style={{
              backgroundImage: `url(https://trello.com/assets/8f9c1323c9c16601a9a4.jpg)`,
              backgroundSize: "cover",
              backgroundPosition: "center center",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
          <h1>Photos</h1>
        </div>
        <div
          className="flex flex-col items-center gap-2"
          onClick={() => goTo("bg-colors")}
        >
          <div
            className="h-32 w-32 rounded-lg shadow-md"
            style={{
              backgroundImage: `url(https://trello.com/assets/97db30fe74a58b7b7a18.png)`,
              backgroundSize: "cover",
              backgroundPosition: "center center",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
          <h1>Colors</h1>
        </div>
      </div>
      <CustomBorder />
      <div className="flex flex-col justify-center ">
        <div className="mt-4 rounded-lg h-40 w-32 flex items-center justify-center bg-gray-600">
          <Plus />
        </div>
        <h1>Custom</h1>
      </div>
    </div>
  );
};
