import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#FFFFFF] text-[#333333] border-t border-gray-200 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center md:items-start text-sm gap-4">

        {/* Left: Location Info */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h2 className="text-lg font-semibold text-[#28A74E]">Geosavvy</h2>
          <p className="text-sm">Tirunelveli</p>
          <p className="text-sm">Tamil Nadu</p>
        </div>

        {/* Right: Contact Info */}
        <div className="text-center md:text-right space-y-1">
          <p>
            <span className="font-normal text-[#333333]">Email:</span>{" "}
            <a
              href="mailto:info@geosavvy.in"
              className="text-[#2EA7E0] hover:underline"
            >
              info@geosavvy.in
            </a>
          </p>
          <p className="pt-2 text-xs text-gray-500">
            © Copyright <span className="font-semibold">Geosavvy</span>. All Rights Reserved
          </p>
          <p className="text-xs text-gray-400">Designed by Geosavvy</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
