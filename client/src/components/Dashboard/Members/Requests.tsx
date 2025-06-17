const Requests = () => {
  return (
    <div>
      <div className="text-white pl-2 py-8 space-y-4 font-charlie-text-r ">
        <h2 className="text-xl ">Join Requests (0)</h2>
        <p className="text-sm text-textP">
          These people have requested to join this Workspace. Adding new
          Workspace members will automatically update your bill.
        </p>
        <div className="text-sm italic text-gray-400 pt-4 border-b border-t border-bg-700 py-4 text-center">
          There are no join request in this Workspace.
        </div>
      </div>
    </div>
  );
};

export default Requests;
