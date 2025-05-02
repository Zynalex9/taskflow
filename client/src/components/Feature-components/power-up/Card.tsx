interface ICARD {
  bannerImg?: string;
  logoImg: string;
  heading: string;
  shortDescription: string;
  users: string;
}
const Card: React.FC<ICARD> = ({
  bannerImg,
  heading,
  logoImg,
  shortDescription,
  users,
}) => {
  return (
    <div className="bg-[#333C43] text-white p-3 rounded-xl shadow-md w-full max-w-xs space-y-3 hover:scale-[1.02] transition-transform duration-200">
      {bannerImg && (
        <img
          src={bannerImg}
          alt="Hero"
          className="rounded-lg w-full object-cover"
        />
      )}

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <img src={logoImg} alt="Icon" className="w-12 h-12" />
          <h2 className="text-lg font-semibold">{heading}</h2>
        </div>
        <button className="bg-[#579DFF] px-4 py-1 rounded-lg">Add</button>
        <p className="text-xs text-gray-300 leading-snug">{shortDescription}</p>

        <div className="flex items-center gap-1 text-gray-400 text-sm">
          <svg
            width="18"
            height="18"
            role="presentation"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className="text-[#FCA311]"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M3 5C3 3.89543 3 5 3 5ZM5 6C5 5.44772 5.44772 5 6 5H10C10.5523 5 11 5.44772 11 6V16C11 16.5523 10.5523 17 10 17H6C5.44772 17 5 16.5523 5 16V6ZM14 5C13.4477 5 13 5.44772 13 6V12C13 12.5523 13.4477 13 14 13H18C18.5523 13 19 12.5523 19 12V6C19 5.44772 18.5523 5 18 5H14Z"
              fill="currentColor"
            ></path>
          </svg>
          <span>{users}</span>
        </div>
      </div>
    </div>
  );
};

export default Card;
