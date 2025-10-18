import React, { useState } from "react";
import { Calendar, Award } from "lucide-react";
import useManageStore from "../src/Store/useManageStore";

const Assignments = () => {
  const [filter, setFilter] = useState("all");

  // Get assignments from store using selector pattern
  const assignments = useManageStore((state) => state.assignments);

  // Hardcoded student ID - matches the ID used in Administrator
  const currentStudentId = 1;

  // Filter assignments for current student
  const studentAssignments = assignments.filter(
    (a) => a.studentId === currentStudentId
  );

  const filteredAssignments =
    filter === "all"
      ? studentAssignments
      : studentAssignments.filter((a) => a.status === filter);

  return (
    <div className="space-y-6 bg-gray-900 min-h-screen p-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-white text-3xl font-bold">Assignments</h1>
          <p className="text-gray-400 mt-2">View your assignments and grades</p>
        </div>
      </div>

      <div className="flex items-center space-x-4 flex-wrap gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === "all"
              ? "bg-yellow-500 text-gray-900"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          }`}
          aria-label="Filter all assignments"
        >
          All ({studentAssignments.length})
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === "pending"
              ? "bg-yellow-500 text-gray-900"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          }`}
          aria-label="Filter pending assignments"
        >
          Pending (
          {studentAssignments.filter((a) => a.status === "pending").length})
        </button>
        <button
          onClick={() => setFilter("submitted")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === "submitted"
              ? "bg-yellow-500 text-gray-900"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          }`}
          aria-label="Filter submitted assignments"
        >
          Submitted (
          {studentAssignments.filter((a) => a.status === "submitted").length})
        </button>
        <button
          onClick={() => setFilter("graded")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === "graded"
              ? "bg-yellow-500 text-gray-900"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          }`}
          aria-label="Filter graded assignments"
        >
          Graded (
          {studentAssignments.filter((a) => a.status === "graded").length})
        </button>
      </div>

      <div className="space-y-4">
        {filteredAssignments.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-12 border border-gray-700 text-center">
            <p className="text-gray-400 text-lg">
              {filter === "all"
                ? "No assignments yet"
                : `No ${filter} assignments`}
            </p>
          </div>
        ) : (
          filteredAssignments.map((assignment) => (
            <div
              key={assignment.id}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-white text-lg font-semibold mb-2">
                    {assignment.title}
                  </h3>
                  {assignment.description && (
                    <p className="text-gray-400 text-sm mb-3">
                      {assignment.description}
                    </p>
                  )}
                  <div className="flex items-center space-x-4 text-sm flex-wrap">
                    <span className="flex items-center space-x-1 text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>Due: {assignment.dueDate}</span>
                    </span>
                    <span className="flex items-center space-x-1 text-gray-400">
                      <Award className="w-4 h-4" />
                      <span>{assignment.points} points</span>
                    </span>
                  </div>
                  {assignment.createdDate && assignment.createdTime && (
                    <p className="text-gray-500 text-xs mt-2">
                      Assigned on: {assignment.createdDate} at{" "}
                      {assignment.createdTime}
                    </p>
                  )}
                  {assignment.status === "graded" && (
                    <div className="mt-4 bg-gray-900 rounded-lg p-4 border border-gray-700">
                      <p className="text-green-400 text-lg font-semibold">
                        Grade: {assignment.grade}/{assignment.points}
                      </p>
                      <p className="text-gray-400 text-sm mt-1">
                        Percentage:{" "}
                        {((assignment.grade / assignment.points) * 100).toFixed(
                          1
                        )}
                        %
                      </p>
                    </div>
                  )}
                  {assignment.status === "submitted" && (
                    <div className="mt-4 bg-gray-900 rounded-lg p-4 border border-gray-700">
                      <p className="text-blue-400 text-sm">
                        Your assignment has been submitted and is awaiting
                        grading.
                      </p>
                    </div>
                  )}
                  {assignment.status === "pending" && (
                    <div className="mt-4 bg-gray-900 rounded-lg p-4 border border-yellow-700">
                      <p className="text-yellow-400 text-sm">
                        This assignment is pending. Please complete and submit
                        it before the due date.
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      assignment.status === "graded"
                        ? "bg-green-500 text-white"
                        : assignment.status === "submitted"
                        ? "bg-blue-500 text-white"
                        : "bg-yellow-500 text-gray-900"
                    }`}
                  >
                    {assignment.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Assignments;
