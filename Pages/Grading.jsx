import React from "react";
import { Award } from "lucide-react";
import useManageStore from "../src/Store/useManageStore";

const Grading = () => {
  const assignments = useManageStore((state) => state.assignments);
  const exercises = useManageStore((state) => state.exercises);
  const projects = useManageStore((state) => state.projects);

  // Calculate grades from graded assignments, exercises, and projects
  const gradedAssignments = assignments.filter((a) => a.status === "graded");
  const gradedExercises = exercises.filter((e) => e.status === "graded");
  const gradedProjects = projects.filter((p) => p.status === "graded");

  // Calculate totals for each category
  const assignmentEarned = gradedAssignments.reduce(
    (sum, a) => sum + (Number(a.grade) || 0),
    0
  );
  const assignmentTotal = gradedAssignments.reduce(
    (sum, a) => sum + (Number(a.points) || 0),
    0
  );
  const assignmentPercentage =
    assignmentTotal > 0
      ? ((assignmentEarned / assignmentTotal) * 100).toFixed(1)
      : "0";

  const exerciseEarned = gradedExercises.reduce(
    (sum, e) => sum + (Number(e.grade) || 0),
    0
  );
  const exerciseTotal = gradedExercises.reduce(
    (sum, e) => sum + (Number(e.points) || 0),
    0
  );
  const exercisePercentage =
    exerciseTotal > 0
      ? ((exerciseEarned / exerciseTotal) * 100).toFixed(1)
      : "0";

  const projectEarned = gradedProjects.reduce(
    (sum, p) => sum + (Number(p.grade) || 0),
    0
  );
  const projectTotal = gradedProjects.reduce(
    (sum, p) => sum + (Number(p.points) || 0),
    0
  );
  const projectPercentage =
    projectTotal > 0 ? ((projectEarned / projectTotal) * 100).toFixed(1) : "0";

  // Calculate overall totals
  const totalEarned = assignmentEarned + exerciseEarned + projectEarned;
  const totalPossible = assignmentTotal + exerciseTotal + projectTotal;
  const overallPercentage =
    totalPossible > 0 ? ((totalEarned / totalPossible) * 100).toFixed(1) : "0";

  // Create grade categories for display
  const gradeCategories = [
    {
      category: "Assignments",
      earned: assignmentEarned,
      total: assignmentTotal,
      percentage: Math.min(parseFloat(assignmentPercentage), 100),
      count: gradedAssignments.length,
    },
    {
      category: "Exercises",
      earned: exerciseEarned,
      total: exerciseTotal,
      percentage: Math.min(parseFloat(exercisePercentage), 100),
      count: gradedExercises.length,
    },
    {
      category: "Projects",
      earned: projectEarned,
      total: projectTotal,
      percentage: Math.min(parseFloat(projectPercentage), 100),
      count: gradedProjects.length,
    },
  ].filter((cat) => cat.total > 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-white text-3xl font-bold">Grading Overview</h1>
        <p className="text-gray-400 mt-2">
          Detailed breakdown of your academic performance
        </p>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center space-x-4 mb-4">
          <Award className="w-10 h-10 text-yellow-500" />
          <div>
            <h2 className="text-white text-2xl font-bold">
              Overall Grade: {totalEarned}/{totalPossible}
            </h2>
            <p className="text-gray-400">
              {overallPercentage}% of total points earned
            </p>
          </div>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-4">
          <div
            className="bg-yellow-500 h-4 rounded-full transition-all duration-300"
            style={{
              width: `${Math.min(parseFloat(overallPercentage), 100)}%`,
            }}
          />
        </div>
      </div>

      <div className="space-y-4">
        {gradeCategories.map((grade, index) => (
          <div
            key={index}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-white font-semibold text-lg">
                  {grade.category}
                </h3>
                <p className="text-gray-500 text-sm">
                  {grade.count} graded item{grade.count !== 1 ? "s" : ""}
                </p>
              </div>
              <span className="text-gray-300 font-semibold">
                {grade.earned}/{grade.total} pts
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
              <div
                className="bg-yellow-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${grade.percentage}%` }}
              />
            </div>
            <p className="text-gray-400 text-sm">
              {grade.percentage}% achieved
            </p>
          </div>
        ))}
        {gradeCategories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">
              No graded assignments, exercises, or projects yet.
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Grades will appear here once your work has been graded by the
              administrator.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Grading;
