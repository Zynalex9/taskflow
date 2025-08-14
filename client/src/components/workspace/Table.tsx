import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { toast, ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
interface IData {
  boardName: string;
  cardName: string;
  dueDate: string;
  labels: { name: string; color: string }[];
  listName: string;
  members: string[];
  _id: string;
}
const Table = () => {
  const { workspace } = useSelector((state: RootState) => state.workspace);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/workspace/${
          workspace?._id
        }/get-table-data`,
        { withCredentials: true }
      );
      if (response.data.success) {
        console.log(response.data);
        setTableData(response.data.data);
      }
    } catch (error: any) {
      console.log(error?.response.data.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (workspace?._id) {
      fetchData();
    }
  }, [workspace]);
  useEffect(() => {
    console.log(tableData);
  }, [tableData]);
  return (
    <div className="p-4">
      <h1 className="font-charlie-display-sm text-5xl text-textP italic">
        Table
      </h1>
      <div className="mt-6 max-h-[70vh] overflow-y-auto custom-scrollbar ">
        <table className="w-full mt-6 border-collapse border-gray-50/50 table-auto text-textP font-charlie-text-r">
          <thead>
            <tr className="text-left text-md">
              <th className="p-3 border-b">S.No</th>
              <th className="p-3 border-b">Card </th>
              <th className="p-3 border-b">List Name</th>
              <th className="p-3 border-b">Label</th>
              <th className="p-3 border-b">Members</th>
              <th className="p-3 border-b">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, idx) => (
                <tr key={idx} className="hover:bg-gray-100/20 transition">
                  <td className="p-3">
                    <Skeleton className="h-4 w-6" />
                  </td>
                  <td className="p-3">
                    <Skeleton className="h-4 w-32" />
                  </td>
                  <td className="p-3">
                    <Skeleton className="h-4 w-24" />
                  </td>
                  <td className="p-3">
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </td>
                  <td className="p-3">
                    <Skeleton className="h-4 w-28" />
                  </td>
                  <td className="p-3">
                    <Skeleton className="h-4 w-20" />
                  </td>
                </tr>
              ))
            ) : tableData.length > 0 ? (
              tableData.map((data: IData, idx) => (
                <tr key={idx} className="hover:bg-gray-100/20 transition">
                  <td className="p-3 ">{idx + 1}</td>
                  <td className="p-3 ">{data.cardName}</td>
                  <td className="p-3 ">{data.listName}</td>
                  <td className="p-3 flex flex-wrap gap-2">
                    {data.labels.length > 0 ? (
                      data.labels.map((label, i) => (
                        <div
                          key={i}
                          className={`flex items-center justify-center text-white text-xs mr-1 rounded-fullpx-1 min-w-14 h-4 truncate rounded `}
                          style={{
                            backgroundColor: label.color,
                          }}
                        >
                          <h2 className="text-xs text-white drop-shadow-md">
                            {label.name && label.name.trim() !== ""
                              ? label.name
                              : ""}
                          </h2>
                        </div>
                      ))
                    ) : (
                      <span className="text-gray-400 italic text-sm">
                        No Label
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    {data.members.length > 0 ? (
                      data.members.map((member, i) => (
                        <span key={i} className="block text-sm">
                          {member}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-400 italic text-sm">
                        No Member
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    {data.dueDate ? data.dueDate : "No Due Date"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="p-3 text-center text-gray-500 italic"
                >
                  No Table Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Table;
