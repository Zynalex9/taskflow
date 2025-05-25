import AddImages from "./AddImages";

const AddBoardModal = () => {
  return (
    <div className="z-[999] shadow-2xl  h-[32rem]  bg-[#282E33] py-4 absolute top-18 left-40 lg:left-62 border-gray-700 border-2 w-[19.5rem] overflow-y-scroll custom-scrollbar text-textP font-charlie-text-r">
      <h1 className="text-sm text-center mb-2 font-charlie-display-sm">Create Board</h1>
      <div
        className="flex items-center justify-center p-2 rounded-md shadow-2xl mx-4"
        style={{
          backgroundImage: `url(https://trello-backgrounds.s3.amazonaws.com/SharedBackground/2560x1707/c176ec219cc71b83695da82802ab31a7/photo-1742156345582-b857d994c84e.webp)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <img
          src="https://trello.com/assets/14cda5dc635d1f13bc48.svg"
          alt=""
          className="rounded shadow-2xs"
        />
      </div>
      <div className="mt-2 px-1.5 space-y-2">
        <h1>Backgrounds</h1>
        <AddImages/>
      </div>
    </div>
  );
};

export default AddBoardModal;
