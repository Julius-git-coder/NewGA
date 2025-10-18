

import React, { useState } from "react";
import { FolderOpen, Calendar, Award } from "lucide-react";
import useManageStore from "../src/Store/useManageStore";

const Projects = () => {
  const [filter, setFilter] = useState("all");

  // Get projects from store (these are the "projects" for students)
  const projects = useManageStore((state) => state.projects);

  // Hardcoded student ID - matches the ID used in Administrator
  const currentStudentId = 1;

  // Filter projects for current student
  const studentProjects = projects.filter(
    (a) => a.studentId === currentStudentId
  );

  const filteredProjects =
    filter === "all"
      ? studentProjects
      : studentProjects.filter((a) => a.status === filter);

  return (
    <div className="space-y-6 bg-gray-900 min-h-screen p-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-white text-3xl font-bold">Projects</h1>
          <p className="text-gray-400 mt-2">
            View your weekly and monthly project submissions
          </p>
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
          aria-label="Filter all projects"
        >
          All ({studentProjects.length})
        </button>
        <button
          onClick={() => setFilter("pending")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === "pending"
              ? "bg-yellow-500 text-gray-900"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          }`}
          aria-label="Filter pending projects"
        >
          In Progress (
          {studentProjects.filter((a) => a.status === "pending").length})
        </button>
      
        <button
          onClick={() => setFilter("submitted")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === "submitted"
              ? "bg-yellow-500 text-gray-900"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          }`}
          aria-label="Filter submitted projects"
        >
          Submitted (
          {studentProjects.filter((a) => a.status === "submitted").length})
        </button>
        <button
          onClick={() => setFilter("graded")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === "graded"
              ? "bg-yellow-500 text-gray-900"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          }`}
          aria-label="Filter graded projects"
        >
          Graded ({studentProjects.filter((a) => a.status === "graded").length})
        </button>
      </div>

      <div className="space-y-4">
        {filteredProjects.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-12 border border-gray-700 text-center">
            <p className="text-gray-400 text-lg">
              {filter === "all" ? "No projects yet" : `No ${filter} projects`}
            </p>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <FolderOpen className="w-5 h-5 text-yellow-500" />
                    <h3 className="text-white text-lg font-semibold">
                      {project.title}
                    </h3>
                  </div>
                  {project.description && (
                    <p className="text-gray-400 text-sm mb-3">
                      {project.description}
                    </p>
                  )}
                  <div className="flex items-center space-x-4 text-sm flex-wrap mb-3">
                    {project.dueDate && (
                      <span className="flex items-center space-x-1 text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>Due: {project.dueDate}</span>
                      </span>
                    )}
                    <span className="flex items-center space-x-1 text-gray-400">
                      <Award className="w-4 h-4" />
                      <span>{project.points} points</span>
                    </span>
                  </div>

                  {project.createdDate && project.createdTime && (
                    <p className="text-gray-500 text-xs mb-3">
                      Created: {project.createdDate} at {project.createdTime}
                    </p>
                  )}

                  {project.status === "graded" &&
                    project.grade !== undefined && (
                      <div className="mt-4 bg-gray-900 rounded-lg p-4 border border-gray-700">
                        <p className="text-green-400 text-lg font-semibold">
                          Grade: {project.grade}/{project.points}
                        </p>
                        <p className="text-gray-400 text-sm mt-1">
                          Percentage:{" "}
                          {((project.grade / project.points) * 100).toFixed(1)}%
                        </p>
                        <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                          <div
                            className="bg-yellow-500 h-2 rounded-full"
                            style={{
                              width: `${
                                (project.grade / project.points) * 100
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  {project.status === "submitted" && (
                    <div className="mt-4 bg-gray-900 rounded-lg p-4 border border-gray-700">
                      <p className="text-blue-400 text-sm">
                        Your project has been submitted and is awaiting grading.
                      </p>
                    </div>
                  )}
                  {project.status === "in-progress" && (
                    <div className="mt-4 bg-gray-900 rounded-lg p-4 border border-blue-700">
                      <p className="text-blue-400 text-sm">
                        This project is in progress. Keep working on it!
                      </p>
                    </div>
                  )}
                  {project.status === "pending" && (
                    <div className="mt-4 bg-gray-900 rounded-lg p-4 border border-yellow-700">
                      <p className="text-yellow-400 text-sm">
                        This project is pending. Please start working on it
                        before the due date.
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      project.status === "graded"
                        ? "bg-green-500 text-white"
                        : project.status === "submitted"
                        ? "bg-blue-500 text-white"
                        : project.status === "in-progress"
                        ? "bg-purple-500 text-white"
                        : "bg-yellow-500 text-gray-900"
                    }`}
                  >
                    {project.status.toUpperCase().replace("-", " ")}
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

export default Projects;