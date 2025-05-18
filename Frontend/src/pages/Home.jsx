import React from "react";
import Register from "../components/Register";
import Recognize from "../components/Recognize";

const Home = () => {
  return (
    <div className="bg-gray-50 min-h-screen text-gray-800 scroll-smooth  p-2">

      <section className="bg-blue-700 text-white rounded-md py-12 px-4 sm:py-16   sm:mx-16 mt-5 ">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4  sm:text-4xl md:text-5xl">
              Face Recognition Attendance System
            </h1>
            <p className="max-w-3xl mx-auto text-base sm:text-lg md:text-xl text-blue-100 mb-6 sm:mb-8 px-2">
              Automate your attendance tracking with AI-powered facial recognition technology.
              Reduce human error, save time, and ensure accurate records.
            </p>
            <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row justify-center gap-3 sm:gap-4">
              <a
                href="#register"
                className="px-6 py-2 sm:px-8 sm:py-3 bg-white text-blue-600 font-medium rounded-lg hover:bg-blue-100 transition duration-300 text-sm sm:text-base"
              >
                Register Faces
              </a>
              <a
                href="#recognize"
                className="px-6 py-2 sm:px-8 sm:py-3 border-2 border-white text-white font-medium rounded-lg  text-sm sm:text-base hover:bg-white hover:text-black transition-all duration-300"
              >
                Recognize Faces
              </a>
            </div>
          </div>
        </div>
      </section>

      
      <section className="py-12 px-4 sm:px-6  sm:mx-16 mt-5 p-2 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
            Key Features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            <div className="bg-gray-50 p-4 hover:bg-gray-200 transition duration-300 sm:p-6 rounded-xl">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">Secure Authentication</h3>
              <p className="text-sm sm:text-base text-gray-600">Facial verification ensures only authorized individuals are marked present.</p>
            </div>
            <div className="bg-gray-50 p-4 hover:bg-gray-200 transition duration-300 sm:p-6 rounded-xl">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">Time Efficient</h3>
              <p className="text-sm sm:text-base text-gray-600">Process attendance in seconds, eliminating manual roll calls.</p>
            </div>
            <div className="bg-gray-50 hover:bg-gray-200 transition duration-300 p-4 sm:p-6 rounded-xl">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">Accurate Reports</h3>
              <p className="text-sm sm:text-base text-gray-600">Generate precise attendance records with timestamps and verification data.</p>
            </div>
          </div>
        </div>
      </section>

  
      <section className="py-12 px-4 sm:px-6 sm:mx-16 mt-5 p-2 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
            Get Started
          </h2>
          <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 items-stretch">
            <div id="register" className="bg-white p-4 sm:p-6 rounded-xl shadow-sm flex-1">
              <Register />
            </div>
            <div id="recognize" className="bg-white p-4 sm:p-6 rounded-xl shadow-sm flex-1">
              <Recognize />
            </div>
          </div>
        </div>
      </section>

      <hr className="mt-4 mb-1 border-t border-gray-300  sm:mx-20 sm:px-16 p-0 " />

      <footer className=" text-white py-6 sm:py-8 px-4 sm:px-6 p-0 ">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <p className="mb-3 sm:mb-2 text-sm text-black">
              © {new Date().getFullYear()} Face Recognition Attendance System
            </p>
            <p className="text-gray-400 text-xs sm:text-sm">
               Developed by Your Challa Venkata Ramana
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;