const GuestPage = () => {
  return (
    <div className="text-white pl-2 py-8 space-y-4 font-charlie-text-r ">
      <h2 className="text-xl ">Guests (0)</h2>
      <p className="text-sm text-textP">
        Guests can only view and edit the boards to which they've been added.
      </p>
      <div className="text-sm italic text-gray-400 pt-4 border-b border-t border-bg-700 py-4 text-center">
        There are no guests in this Workspace.
      </div>
    </div>
  );
};

export default GuestPage;
