import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-gray-400  text-white shadow-md ">
      <div className="max-w-6xl   px-4 py-3 flex items-center sm:mx-16 justify-between">
        <h1 className="text-xl font-bold">Face Attendance</h1>

     
        <button
          className="md:hidden text-white text-2xl focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <FaBars />
        </button>

       
        <nav className="hidden md:flex space-x-6 font-semibold">
          <Link
            to="/"
            className="px-3 py-2 rounded-md hover:bg-gray-700 transition duration-300"
          >
            Home
          </Link>
          <Link
            to="/attendance"
            className="px-3 py-2 rounded-md hover:bg-gray-700 transition duration-300"
          >
            Attendance
          </Link>
        </nav>
      </div>

      
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-40" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col items-start px-4 pb-4 font-semibold">
          <Link
            to="/"
            className="w-full px-3 py-2 rounded-md hover:bg-gray-700 transition duration-300"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/attendance"
            className="w-full px-3 py-2 rounded-md hover:bg-gray-700 transition duration-300"
            onClick={() => setIsOpen(false)}
          >
            Attendance
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
