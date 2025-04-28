const HeroSection = () => {
    return (
      <div className="w-full h-screen flex items-center bg-gray-50 pl-10 mt-0">
        {/* Left side */}
        <div className="w-1/2 flex flex-col justify-center space-y-6">
          <h2 className="text-heading font-charlie-display-sm text-4xl md:text-5xl font-bold leading-tight max-w-xl">
            Capture, organize, and tackle your to-dos from anywhere.
          </h2>
  
          <h3 className="text-gray-600 text-lg max-w-lg">
            Escape the clutter and chaos—unleash your productivity with Trello.
          </h3>
  
          <div className="flex space-x-2 mt-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-3 rounded-md border border-gray-300 focus:outline-none w-64"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md">
              Sign up - it's free!
            </button>
          </div>
        </div>
  
        <div className="w-1/2 flex justify-center items-center mt-7">
          <video
            src="/n20-hero-cropped2.mov"
            className="w-full h-full object-contain"
            autoPlay
            muted
          />
        </div>
      </div>
    );
  };
  
  export default HeroSection;
  