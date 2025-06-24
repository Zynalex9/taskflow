import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { Pencil, X } from "lucide-react";
import { Link } from "react-router-dom";

export const ProfileCard = ({
  setShowCard,
}: {
  setShowCard: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <Card className="w-[300px]  bg-fprimary text-textP overflow-hidden p-0 shadow-lg">
      <CardHeader className="w-full bg-[#579DFF] h-20 p-0 flex px-2 py-1 justify-end">
        <X
          className="text-black "
          size={18}
          onClick={() => setShowCard(false)}
        />
      </CardHeader>
      <CardContent className="px-4 pb-2 pt-0">
        <div className="relative">
          <div className="absolute -top-14 left-0">
            <img
              src={user?.profilePicture}
              alt="Profile"
              className="size-19 object-center object-cover rounded-full border-4 border-white bg-white"
            />
          </div>

          <div className="pt-10">
            <h3 className="text-lg font-semibold">
              {user?.firstName} {user?.secondName}
            </h3>
            <p className="text-sm text-textP">@{user?.username}</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col items-start gap-2 px-4 pb-4">
        <Link to={`/user/dashboard/edit-info`} className="w-full">
          <div className="flex items-center gap-2 text-sm text-textP">
            <Pencil className="size-4" />
            <h1>Edit profile info</h1>
          </div>
        </Link>
      </CardFooter>
    </Card>
  );
};
