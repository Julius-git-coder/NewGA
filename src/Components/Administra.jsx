// Administra.jsx
import React from "react";
import useManageStore from "../Store/useManageStore";
import { Dumbbell, FolderOpen, Edit, Trash2 } from "lucide-react";

const Administra = ({
  activeTab,
  searchTerm,
  setSearchTerm,
  setSelectedForm,
  setFormData,
  formData,
  recentStudents,
  assignments,
  exercises,
  projects,
}) => {
  // Store actions
  const updateAssignment = useManageStore((state) => state.updateAssignment);
  const deleteAssignment = useManageStore((state) => state.deleteAssignment);
  const updateExercise = useManageStore((state) => state.updateExercise);
  const deleteExercise = useManageStore((state) => state.deleteExercise);
  const updateProject = useManageStore((state) => state.updateProject);
  const deleteProject = useManageStore((state) => state.deleteProject);

  // Handlers for assignments
  const handleEditAssignment = (assignment) => {
    setFormData({
      id: assignment.id,
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.dueDate,
      points: assignment.points,
      studentId: assignment.studentId,
    });
    setSelectedForm("assignment-edit");
  };

  const handleDeleteAssignment = (assignmentId) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      deleteAssignment(assignmentId);
      alert("Assignment deleted successfully!");
    }
  };

  // Handlers for exercises
  const handleEditExercise = (exercise) => {
    setFormData({
      id: exercise.id,
      title: exercise.title,
      description: exercise.description,
      points: exercise.points,
      studentId: exercise.studentId,
    });
    setSelectedForm("exercise-edit");
  };

  const handleDeleteExercise = (exerciseId) => {
    if (window.confirm("Are you sure you want to delete this exercise?")) {
      deleteExercise(exerciseId);
      alert("Exercise deleted successfully!");
    }
  };

  // Handlers for projects
  const handleEditProject = (project) => {
    setFormData({
      id: project.id,
      title: project.title,
      description: project.description,
      dueDate: project.dueDate,
      points: project.points,
      studentId: project.studentId,
    });
    setSelectedForm("project-edit");
  };

  const handleDeleteProject = (projectId) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      deleteProject(projectId);
      alert("Project deleted successfully!");
    }
  };

  // Shared handlers for grading
  const handleMarkSubmitted = (id, type) => {
    if (type === "assignment") {
      updateAssignment(id, { status: "submitted" });
      alert("Assignment marked as submitted!");
    } else if (type === "exercise") {
      updateExercise(id, { status: "submitted" });
      alert("Exercise marked as submitted!");
    } else if (type === "project") {
      updateProject(id, { status: "submitted" });
      alert("Project marked as submitted!");
    }
  };

  const handleGradeChange = (id, value) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleGradeSubmit = (id, type) => {
    const grade = parseFloat(formData[id]);
    let item;
    let points;
    if (type === "assignment") {
      item = assignments.find((a) => a.id === id);
      points = item.points;
      if (isNaN(grade) || grade < 0 || grade > points) {
        alert(`Please enter a valid grade between 0 and ${points} points.`);
        return;
      }
      updateAssignment(id, { status: "graded", grade });
    } else if (type === "exercise") {
      item = exercises.find((e) => e.id === id);
      points = item.points;
      if (isNaN(grade) || grade < 0 || grade > points) {
        alert(`Please enter a valid grade between 0 and ${points} points.`);
        return;
      }
      updateExercise(id, { status: "graded", grade });
    } else if (type === "project") {
      item = projects.find((p) => p.id === id);
      points = item.points;
      if (isNaN(grade) || grade < 0 || grade > points) {
        alert(`Please enter a valid grade between 0 and ${points} points.`);
        return;
      }
      updateProject(id, { status: "graded", grade });
    }
    setFormData((prev) => ({ ...prev, [id]: "" }));
    alert("Grade submitted successfully!");
  };

  // Filtered data
  const filteredAssignments = assignments.filter(
    (a) =>
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recentStudents
        .find((s) => s.id === a.studentId)
        ?.name.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const filteredExercises = exercises.filter(
    (e) =>
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recentStudents
        .find((s) => s.id === e.studentId)
        ?.name.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recentStudents
        .find((s) => s.id === p.studentId)
        ?.name.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Assignments Tab */}
      {activeTab === "assignments" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-white text-lg font-semibold">
              All Assignments
            </h3>
            <button
              onClick={() => {
                setSelectedForm("assignment");
                setFormData({});
              }}
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg font-semibold"
            >
              New Assignment
            </button>
          </div>
          <input
            type="text"
            placeholder="Search assignments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
          />
          {filteredAssignments.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-12 border border-gray-700 text-center">
              <p className="text-gray-400 text-lg">No assignments yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="bg-gray-800 rounded-lg p-6 border border-gray-700"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="text-white font-semibold text-lg mb-2">
                        {assignment.title}
                      </h4>
                      {assignment.description && (
                        <p className="text-gray-400 text-sm mb-3">
                          {assignment.description}
                        </p>
                      )}
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-gray-400">
                          Due: {assignment.dueDate}
                        </span>
                        <span className="text-gray-400">
                          {assignment.points} points
                        </span>
                        <span className="text-gray-400">
                          Student:{" "}
                          {
                            recentStudents.find(
                              (s) => s.id === assignment.studentId
                            )?.name
                          }
                        </span>
                      </div>
                      {assignment.createdDate && assignment.createdTime && (
                        <p className="text-gray-500 text-xs mt-2">
                          Created: {assignment.createdDate} at{" "}
                          {assignment.createdTime}
                        </p>
                      )}
                      {assignment.status === "pending" && (
                        <div className="mt-4 flex items-center space-x-3">
                          <button
                            onClick={() =>
                              handleMarkSubmitted(assignment.id, "assignment")
                            }
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold"
                          >
                            Mark as Submitted
                          </button>
                        </div>
                      )}
                      {assignment.status === "submitted" && (
                        <div className="mt-4 flex items-center space-x-3">
                          <input
                            type="number"
                            value={formData[assignment.id] || ""}
                            onChange={(e) =>
                              handleGradeChange(assignment.id, e.target.value)
                            }
                            className="w-24 bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                            placeholder="Grade"
                          />
                          <button
                            onClick={() =>
                              handleGradeSubmit(assignment.id, "assignment")
                            }
                            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg font-semibold"
                          >
                            Submit Grade
                          </button>
                        </div>
                      )}
                      {assignment.status === "graded" && (
                        <div className="mt-3">
                          <p className="text-green-400 text-sm font-semibold">
                            Graded: {assignment.grade}/{assignment.points}
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
                      <button
                        onClick={() => handleEditAssignment(assignment)}
                        className="text-yellow-500 hover:text-yellow-400"
                        title="Edit Assignment"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteAssignment(assignment.id)}
                        className="text-red-500 hover:text-red-400"
                        title="Delete Assignment"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Exercises Tab */}
      {activeTab === "exercises" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-white text-lg font-semibold flex items-center space-x-2">
              <Dumbbell className="w-5 h-5 text-yellow-500" />
              <span>All Exercises</span>
            </h3>
            <button
              onClick={() => {
                setSelectedForm("exercise");
                setFormData({});
              }}
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg font-semibold"
            >
              New Exercise
            </button>
          </div>
          <input
            type="text"
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
          />
          {filteredExercises.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-12 border border-gray-700 text-center">
              <p className="text-gray-400 text-lg">No exercises yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredExercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className="bg-gray-800 rounded-lg p-6 border border-gray-700"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="text-white font-semibold text-lg mb-2">
                        {exercise.title}
                      </h4>
                      {exercise.description && (
                        <p className="text-gray-400 text-sm mb-3">
                          {exercise.description}
                        </p>
                      )}
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-gray-400">
                          {exercise.points} points
                        </span>
                        <span className="text-gray-400">
                          Student:{" "}
                          {
                            recentStudents.find(
                              (s) => s.id === exercise.studentId
                            )?.name
                          }
                        </span>
                      </div>
                      {exercise.createdDate && exercise.createdTime && (
                        <p className="text-gray-500 text-xs mt-2">
                          Created: {exercise.createdDate} at{" "}
                          {exercise.createdTime}
                        </p>
                      )}
                      {exercise.status === "pending" && (
                        <div className="mt-4 flex items-center space-x-3">
                          <button
                            onClick={() =>
                              handleMarkSubmitted(exercise.id, "exercise")
                            }
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold"
                          >
                            Mark as Submitted
                          </button>
                        </div>
                      )}
                      {exercise.status === "submitted" && (
                        <div className="mt-4 flex items-center space-x-3">
                          <input
                            type="number"
                            value={formData[exercise.id] || ""}
                            onChange={(e) =>
                              handleGradeChange(exercise.id, e.target.value)
                            }
                            className="w-24 bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                            placeholder="Grade"
                          />
                          <button
                            onClick={() =>
                              handleGradeSubmit(exercise.id, "exercise")
                            }
                            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg font-semibold"
                          >
                            Submit Grade
                          </button>
                        </div>
                      )}
                      {exercise.status === "graded" && (
                        <div className="mt-3">
                          <p className="text-green-400 text-sm font-semibold">
                            Graded: {exercise.grade}/{exercise.points}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          exercise.status === "graded"
                            ? "bg-green-500 text-white"
                            : exercise.status === "submitted"
                            ? "bg-blue-500 text-white"
                            : "bg-yellow-500 text-gray-900"
                        }`}
                      >
                        {exercise.status.toUpperCase()}
                      </span>
                      <button
                        onClick={() => handleEditExercise(exercise)}
                        className="text-yellow-500 hover:text-yellow-400"
                        title="Edit Exercise"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteExercise(exercise.id)}
                        className="text-red-500 hover:text-red-400"
                        title="Delete Exercise"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Projects Tab */}
      {activeTab === "projects" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-white text-lg font-semibold flex items-center space-x-2">
              <FolderOpen className="w-5 h-5 text-yellow-500" />
              <span>All Projects</span>
            </h3>
            <button
              onClick={() => {
                setSelectedForm("project");
                setFormData({});
              }}
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg font-semibold"
            >
              New Project
            </button>
          </div>
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
          />
          {filteredProjects.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-12 border border-gray-700 text-center">
              <p className="text-gray-400 text-lg">No projects yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-gray-800 rounded-lg p-6 border border-gray-700"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="text-white font-semibold text-lg mb-2">
                        {project.title}
                      </h4>
                      {project.description && (
                        <p className="text-gray-400 text-sm mb-3">
                          {project.description}
                        </p>
                      )}
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-gray-400">
                          Due: {project.dueDate}
                        </span>
                        <span className="text-gray-400">
                          {project.points} points
                        </span>
                        <span className="text-gray-400">
                          Student:{" "}
                          {
                            recentStudents.find(
                              (s) => s.id === project.studentId
                            )?.name
                          }
                        </span>
                      </div>
                      {project.createdDate && project.createdTime && (
                        <p className="text-gray-500 text-xs mt-2">
                          Created: {project.createdDate} at{" "}
                          {project.createdTime}
                        </p>
                      )}
                      {project.status === "pending" && (
                        <div className="mt-4 flex items-center space-x-3">
                          <button
                            onClick={() =>
                              handleMarkSubmitted(project.id, "project")
                            }
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold"
                          >
                            Mark as Submitted
                          </button>
                        </div>
                      )}
                      {project.status === "submitted" && (
                        <div className="mt-4 flex items-center space-x-3">
                          <input
                            type="number"
                            value={formData[project.id] || ""}
                            onChange={(e) =>
                              handleGradeChange(project.id, e.target.value)
                            }
                            className="w-24 bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                            placeholder="Grade"
                          />
                          <button
                            onClick={() =>
                              handleGradeSubmit(project.id, "project")
                            }
                            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg font-semibold"
                          >
                            Submit Grade
                          </button>
                        </div>
                      )}
                      {project.status === "graded" && (
                        <div className="mt-3">
                          <p className="text-green-400 text-sm font-semibold">
                            Graded: {project.grade}/{project.points}
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
                            : "bg-yellow-500 text-gray-900"
                        }`}
                      >
                        {project.status.toUpperCase()}
                      </span>
                      <button
                        onClick={() => handleEditProject(project)}
                        className="text-yellow-500 hover:text-yellow-400"
                        title="Edit Project"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project.id)}
                        className="text-red-500 hover:text-red-400"
                        title="Delete Project"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Administra;
