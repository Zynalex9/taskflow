import DropdownHeader from "../../DropdownHeader";

const AddAttachment = () => {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("uploadedFile", file);

    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
  };
  return (
    <div className="absolute top-2 left-2 w-72 rounded bg-[#282E33] p-4 shadow-2xl text-white z-30">
      <DropdownHeader headerText="Add an attachment" />
      <h1 className="text-textP text-center font-charlie-text-r text-sm my-2">
        Add a file from your computer
      </h1>
      <div className="bg-[#B6C2CF]/20 rounded hover:bg-[#B6C2CF]/10 w-full my-4 p-2">
        <input type="file" onChange={handleFileChange} />
      </div>
    </div>
  );
};

export default AddAttachment;
