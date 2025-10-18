import React from "react";
import { Code } from "lucide-react";
import useManageStore from "../src/Store/useManageStore";


const DaysOfLearning = () => {
  const { daysOfLearning } = useManageStore();
  const {
    completedDays = 0,
    totalDays = 100,
    activities = [],
  } = daysOfLearning;
  const percentage =
    totalDays > 0 ? ((completedDays / totalDays) * 100).toFixed(0) : 0;

  const days = Array.from({ length: totalDays }, (_, i) => ({
    day: i + 1,
    completed: i < completedDays,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-white text-3xl font-bold">100 Days Of Excellence</h1>
        <p className="text-gray-400 mt-2">Track your learning journey</p>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-white text-2xl font-bold">
              Day {completedDays} of {totalDays}
            </h3>
            <p className="text-gray-400">Keep up the great work!</p>
          </div>
          <Code className="w-12 h-12 text-yellow-500" />
        </div>
        <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
          <div
            className="bg-yellow-500 h-4 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="text-gray-400 text-sm">{percentage}% complete</p>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-white text-lg font-semibold mb-4">
          Progress Calendar
        </h3>
        <div className="grid grid-cols-10 gap-2">
          {days.map((day) => (
            <div
              key={day.day}
              className={`aspect-square rounded flex items-center justify-center text-xs font-semibold transition-colors ${
                day.completed
                  ? "bg-yellow-500 text-gray-900"
                  : "bg-gray-700 text-gray-400"
              }`}
            >
              {day.day}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-white text-lg font-semibold mb-4">
          Recent Activity
        </h3>
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-900 rounded-lg"
            >
              <div>
                <p className="text-white font-medium">
                  Day {activity.day} - {activity.content}
                </p>
                <p className="text-gray-400 text-sm">{activity.timestamp}</p>
              </div>
              <Code className="w-5 h-5 text-yellow-500" />
            </div>
          ))}
          {activities.length === 0 && (
            <p className="text-gray-400 text-center">No recent activity.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DaysOfLearning;
