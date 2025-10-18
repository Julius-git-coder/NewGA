import React from "react";
import { UserCheck, Calendar, TrendingUp } from "lucide-react";
import useManageStore from "../src/Store/useManageStore";

const Attendance = () => {
  const attendance = useManageStore((state) => state.attendance);
  const currentStudentId = 1; // Hardcoded to match Administrator

  // Filter attendance records for the current student
  const studentAttendance = attendance.filter(
    (record) => record.studentId === currentStudentId
  );

  const presentCount = studentAttendance.filter(
    (d) => d.status === "present"
  ).length;
  const totalClasses = studentAttendance.length;
  const percentage =
    totalClasses > 0 ? ((presentCount / totalClasses) * 100).toFixed(1) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-white text-3xl font-bold">Attendance</h1>
        <p className="text-gray-400 mt-2">Track your class attendance record</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center space-x-3 mb-2">
            <UserCheck className="w-6 h-6 text-green-500" />
            <h3 className="text-white font-semibold">Present</h3>
          </div>
          <p className="text-3xl font-bold text-white">{presentCount}</p>
          <p className="text-gray-400 text-sm">classes attended</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center space-x-3 mb-2">
            <Calendar className="w-6 h-6 text-red-500" />
            <h3 className="text-white font-semibold">Absent</h3>
          </div>
          <p className="text-3xl font-bold text-white">
            {totalClasses - presentCount}
          </p>
          <p className="text-gray-400 text-sm">classes missed</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center space-x-3 mb-2">
            <TrendingUp className="w-6 h-6 text-yellow-500" />
            <h3 className="text-white font-semibold">Attendance Rate</h3>
          </div>
          <p className="text-3xl font-bold text-white">{percentage}%</p>
          <p className="text-gray-400 text-sm">overall attendance</p>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-white text-lg font-semibold mb-4">
          Attendance History
        </h3>
        <div className="space-y-3">
          {studentAttendance.map((record, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gray-900 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`w-3 h-3 rounded-full ${
                    record.status === "present" ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                <div>
                  <p className="text-white font-medium">{record.topic}</p>
                  <p className="text-gray-400 text-sm">{record.date}</p>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  record.status === "present"
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                {record.status.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Attendance;
