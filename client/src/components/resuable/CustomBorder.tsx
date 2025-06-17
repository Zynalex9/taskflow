const CustomBorder = ({ customStyles }: { customStyles?: string }) => {
  return (
    <div
      className={`border-t border-gray-500  scale-y-[0.50] ${customStyles}`}
    ></div>
  );
};

export default CustomBorder;
