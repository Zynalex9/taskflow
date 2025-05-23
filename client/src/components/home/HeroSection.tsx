const HeroSection = () => {
  return (
    <div className="w-full min-h-screen flex flex-col lg:flex-row items-center bg-gray-50 px-4 lg:py-0 lg:pl-10">
      
      {/* Left Side (Text) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-start space-y-6 text-center lg:text-left mt-8 lg:mt-0">
        <h2 className="text-heading font-charlie-display-sm pt-16 lg:pt-0 text-4xl sm:text-4xl md:text-5xl font-bold leading-tight max-w-xl">
          Capture, organize, and tackle your to-dos from anywhere.
        </h2>
        <h3 className="text-gray-600 text-base sm:max-lg:text-xl ">
          Escape the clutter and chaos—unleash your productivity with Trello.
        </h3>

        <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-3 sm:space-y-0 mt-4 w-full sm:w-auto">
          <input
            type="email"
            placeholder="Enter your email"
            className="px-4 py-3 hidden lg:block rounded-md border border-gray-300 focus:outline-none w-full sm:w-64"
          />
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md w-full sm:w-auto">
            Sign up - it's free!
          </button>
        </div>
      </div>

      {/* Right Side (Video) */}
      <div className="w-full mt-6 lg:mt-0 lg:w-1/2 flex justify-center items-center">
        <video
          src="/n20-hero-cropped2.mov"
          className="w-full h-full max-lg:h-[400px] object-contain"
          autoPlay
          muted
        />
      </div>
    </div>
  );
};

export default HeroSection;
