import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white text-[#333333] border-t border-gray-200 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-6 text-sm">

        {/* Left: Location Info */}
        <div className="flex flex-col items-start text-left">
          <h2 className="text-xl font-bold text-[#2EAF7D]">Geosavvy</h2>
          <p>Tirunelveli</p>
          <p>Tamil Nadu</p>
        </div>

        {/* Right: Contact Info */}
        <div className="flex flex-col items-end text-right space-y-1">
          <p>
            <span className="font-medium text-[#02353C]">Email:</span>{" "}
            <a
              href="mailto:info@geosavvy.in"
              className="text-[#2EA7E0] hover:underline"
            >
              info@geosavvy.in
            </a>
          </p>
          <p className="text-xs text-gray-500 pt-2">
            © {new Date().getFullYear()} <span className="font-semibold">Geosavvy</span>. All Rights Reserved.
          </p>
          <p className="text-xs text-gray-400">Designed by Geosavvy</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
