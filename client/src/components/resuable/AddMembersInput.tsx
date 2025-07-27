export const AddMembersInput = () => {
  return (
    <div>
      <p className="text-textP text-xl py-2 font-charlie-text-r text-center">
        Add Members
      </p>
      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Search a Taskflow user"
          className="w-full px-2 py-1.5 ring-1 ring-blue-600 rounded-md text-textP my-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
          Add
        </button>
      </div>
    </div>
  );
};
