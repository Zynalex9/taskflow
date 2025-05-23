import { ChangeEvent, useState } from "react";
import { AppDispatch, RootState } from "../../../store/store"
import { useDispatch, useSelector } from "react-redux";
import { Pencil, X } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { updateDetails } from "../../../store/AuthSlice";

const UsernameEmail = () => {
  const { user,error } = useSelector((state: RootState) => state.auth);
  const [username, setUsername] = useState<string>(user?.username ?? "");
  const [email, setEmail] = useState<string>(user?.email ?? "");
  const [isChaning, setIsChanging] = useState({
    username: false,
    email: false,
  });
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    if (!user) {
      toast.error("User not found", {
        autoClose: 1000
      });
      return;
    }
    if (username !== user.username || email !== user.email) {
      setLoading(true)
      const resultAction =await dispatch(updateDetails({ username, email }));
      if (updateDetails.fulfilled.match(resultAction)) {
        toast.success("Details Updated");
        setLoading(false)
        setIsChanging({...isChaning,username:false,email:false})
      }else{
        toast.error(error)
        setLoading(false)
      }
    }else{
      toast.error("Please enter new detail",{
        autoClose:1000
      })
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto mt-10 p-6 bg-fprimary shadow-md rounded-xl space-y-6">
      <div className="flex items-center justify-between">
        {isChaning.username ? (
          <div className="flex items-center gap-3 w-full">
            <input
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-primary"
              type="text"
              value={username}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setUsername(e.target.value)
              }
            />
            <button
              className="text-red-500 hover:text-red-700"
              onClick={() => setIsChanging({ ...isChaning, username: false })}
            >
              <X size={22} />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <h1 className="text-lg">Username: {username}</h1>
            <button
              className="text-blue-500 hover:text-blue-700"
              onClick={() => setIsChanging({ ...isChaning, username: true })}
            >
              <Pencil size={22} />
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        {isChaning.email ? (
          <div className="flex items-center gap-3 w-full">
            <input
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-primary"
              type="text"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            />
            <button
              className="text-red-500 hover:text-red-700"
              onClick={() => setIsChanging({ ...isChaning, email: false })}
            >
              <X size={22} />
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between w-full">
            <h1 className="text-lg">Email: {email}</h1>
            <button
              className="text-blue-500 hover:text-blue-700"
              onClick={() => setIsChanging({ ...isChaning, email: true })}
            >
              <Pencil size={22} />
            </button>
          </div>
        )}
      </div>

      {(isChaning.email || isChaning.username) && (
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`bg-blue-primary cursor-pointer text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Updating..." : "Submit"}
          </button>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default UsernameEmail;
