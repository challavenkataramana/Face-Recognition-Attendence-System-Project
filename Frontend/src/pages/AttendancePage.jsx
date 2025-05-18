import React from "react";
import Attendance from "../components/Attendance";
import Card from "../components/Card";

const AttendancePage = () => (
  <div className="max-w-5xl mx-auto px-4 py-10">
    <Card title="Attendance Records">
      <Attendance />
    </Card>
  </div>
);

export default AttendancePage;
