import React from "react";

const Footer = () => {
  return (
    <footer className=" bg-white text-[#1b1a1a] border-t border-gray-200 w-full  shadow-md">
      <div className="w-full px-4 sm:px-6 lg:px-4 py-4 max-w-xl mx-auto flex flex-col md:flex-col justify-between gap-4 text-sm">
        <div className="flex flex-col items-center font-sans ">
          {/* <p>
            <span className="font-medium text-[#02353C]">Email:</span>{" "}
            <a
              href="mailto:info@geosavvy.in"
              className="text-[#2EA7E0] hover:underline"
            >
              info@geosavvy.in
            </a>
          </p> */}
          <p className=" font-medium text-gray-700 pt-2">
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold">Geosavvy</span>. All Rights
            Reserved.
          </p>
          <p className="font-stretch-50% text-gray-600">Designed by Geosavvy</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
