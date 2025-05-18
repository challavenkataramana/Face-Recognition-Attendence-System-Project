import React from "react";
import { Routes, Route } from "react-router-dom"; 
import Header from "./components/Header";
import Home from "./pages/Home";
import Attendance from "./components/Attendance";

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/attendance" element={<Attendance />} />
      </Routes>
    </>
  );
};

export default App;
