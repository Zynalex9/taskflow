interface IProps {
  setOpenSideBar: React.Dispatch<React.SetStateAction<boolean>>;
  openSidebar:boolean
}

const RightSideBar = ({ openSidebar, setOpenSideBar }: IProps) => {
  return (
    <div
      className={`fixed right-0 top-0 transition-transform duration-300 ease-in-out transform bg-[#282E33] w-[20rem] h-[89vh] z-50 ${
        openSidebar ? 'translate-x-0' : 'translate-x-full'
      }`}
    ></div>
  );
};

export default RightSideBar;
