import { Facebook, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <div className="w-full bg-[#172B4D] p-8">
      <div className="before-footer w-full flex items-center justify-between text-white font-charlie-text-r">
        <h1 className="font-charlie-display-sm text-4xl">Taskflow</h1>
        <div className="transition-all duration-200 px-4 py-8 hover:bg-gray-400/50">
          <h1 className="text-2xl pb-2">About Taskflow</h1>
          <p className="text-xs">What’s behind the boards.</p>
        </div>
        <div className="transition-all duration-200 px-4 py-8 hover:bg-gray-400/50">
          <h1 className="text-2xl pb-2">Jobs</h1>
          <p className="text-xs">What’s behind the boards.</p>
        </div>
        <div className="transition-all duration-200 px-4 py-8 hover:bg-gray-400/50">
          <h1 className="text-2xl pb-2">Apps</h1>
          <p className="text-xs">What’s behind the boards.</p>
        </div>
        <div className="transition-all duration-200 px-4 py-8 hover:bg-gray-400/50">
          <h1 className="text-2xl pb-2">Contact us</h1>
          <p className="text-xs">What’s behind the boards.</p>
        </div>
      </div>
      <div className="footer border-t border-gray-400 w-full text-white flex items-center justify-between">
        <div className="flex gap-4 mt-3 font-charlie-text-r text-xs">
          <h1 className="transition-all duration-200 ease-in cursor-pointer hover:border-b">Privacy Policy</h1>
          <h1 className="transition-all duration-200 ease-in cursor-pointer hover:border-b">Terms</h1>
          <h1 className="transition-all duration-200 ease-in cursor-pointer hover:border-b">Copyright © 2025 Taskflow</h1>
        </div>
        <div className="flex gap-4 mt-3">
          <Facebook  className="border-2 rounded-full transition-transform duration-200 hover:scale-90 p-1 cursor-pointer"/>
          <Instagram className="border-2 rounded-full transition-transform duration-200 hover:scale-90 p-1 cursor-pointer"/>
          <Linkedin className="border-2 rounded-full transition-transform duration-200 hover:scale-90 p-1 cursor-pointer"/>
        </div>
      </div>
    </div>
  );
};

export default Footer;
