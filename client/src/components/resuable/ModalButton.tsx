const ModalButton = ({
  btnText,
  onClickFn,
  customStyles,
}: {
  btnText: string;
  onClickFn?: () => void | Promise<void>;
  customStyles?: string;
}) => {
  return (
    <button
      onClick={onClickFn}
      className={`flex gap-2 px-2 py-1 rounded cursor-pointer items-center transition-colors duration-150 bg-[#B6C2CF]/20 hover:bg-[#B6C2CF]/10 font-charlie-display-sm shadow-2xl text-[#B3BFCC] ${customStyles}`}
    >
      {btnText}
    </button>
  );
};

export default ModalButton;
