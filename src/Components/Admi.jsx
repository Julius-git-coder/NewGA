// Admi.jsx
import React from "react";
import useManageStore from "../Store/useManageStore";
import {
  Dumbbell,
  FolderOpen,
  UserCheck,
  Map,
  BookOpen,
  Briefcase,
  Download,
  ExternalLink,
  CheckCircle,
  Edit,
  Trash2,
} from "lucide-react";

const Admi = ({
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
  attendance,
  roadmapItems,
  classMaterials,
  programs,
}) => {
  // Local store actions for this component
  const deleteAssignment = useManageStore((state) => state.deleteAssignment);
  const updateAssignment = useManageStore((state) => state.updateAssignment);
  const deleteExercise = useManageStore((state) => state.deleteExercise);
  const updateExercise = useManageStore((state) => state.updateExercise);
  const deleteProject = useManageStore((state) => state.deleteProject);
  const updateProject = useManageStore((state) => state.updateProject);
  const deleteAttendance = useManageStore((state) => state.deleteAttendance);
  const updateAttendance = useManageStore((state) => state.updateAttendance);
  const deleteRoadmapItem = useManageStore((state) => state.deleteRoadmapItem);
  const setCurrentWeek = useManageStore((state) => state.setCurrentWeek);
  const toggleSubTopicComplete = useManageStore(
    (state) => state.toggleSubTopicComplete
  );
  const deleteSubTopic = useManageStore((state) => state.deleteSubTopic);
  const deleteClassMaterial = useManageStore(
    (state) => state.deleteClassMaterial
  );
  const deleteProgram = useManageStore((state) => state.deleteProgram);
  const adminToggleMilestoneComplete = useManageStore(
    (state) => state.adminToggleMilestoneComplete
  );
  const approveJoinRequest = useManageStore(
    (state) => state.approveJoinRequest
  );
  const rejectJoinRequest = useManageStore((state) => state.rejectJoinRequest);

  // Local handlers for assignments
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

  // Local handlers for exercises
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

  // Local handlers for projects
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

  // Local handlers for attendance
  const handleEditAttendance = (record) => {
    setFormData({
      id: record.id,
      date: record.date,
      status: record.status,
      topic: record.topic,
      studentId: record.studentId,
    });
    setSelectedForm("attendance-edit");
  };

  const handleDeleteAttendance = (attendanceId) => {
    if (
      window.confirm("Are you sure you want to delete this attendance record?")
    ) {
      deleteAttendance(attendanceId);
      alert("Attendance record deleted successfully!");
    }
  };

  // Local handlers for roadmap
  const handleEditRoadmapItem = (roadmapItem) => {
    setFormData({
      id: roadmapItem.id,
      phase: roadmapItem.phase,
      term: roadmapItem.term,
      status: roadmapItem.status,
    });
    setSelectedForm("roadmap-edit");
  };

  const handleSetCurrentWeek = (roadmapId, weekIndex) => {
    setCurrentWeek(roadmapId, weekIndex);
    alert("Current week set successfully!");
  };

  const handleToggleSubTopicComplete = (roadmapId, weekIndex, subTopicId) => {
    toggleSubTopicComplete(roadmapId, weekIndex, subTopicId);
    alert("Subtopic completion status toggled!");
  };

  const handleDeleteSubTopic = (roadmapId, weekIndex, subTopicId) => {
    if (window.confirm("Are you sure you want to delete this subtopic?")) {
      deleteSubTopic(roadmapId, weekIndex, subTopicId);
      alert("Subtopic deleted successfully!");
    }
  };

  const handleDeleteRoadmapItem = (roadmapId) => {
    if (window.confirm("Are you sure you want to delete this roadmap item?")) {
      deleteRoadmapItem(roadmapId);
      alert("Roadmap item deleted successfully!");
    }
  };

  // Local handlers for class materials
  const handleEditClassMaterial = (material) => {
    setFormData({
      id: material.id,
      title: material.title,
      week: material.week,
      resources: material.resources,
      topics: material.topics.join(", "),
    });
    setSelectedForm("classmaterial-edit");
  };

  const handleDeleteClassMaterial = (materialId) => {
    if (
      window.confirm("Are you sure you want to delete this class material?")
    ) {
      deleteClassMaterial(materialId);
      alert("Class material deleted successfully!");
    }
  };

  // Local handlers for programs
  const handleEditProgram = (program) => {
    setFormData({
      id: program.id,
      name: program.name,
      description: program.description,
      totalMilestones: program.totalMilestones,
    });
    setSelectedForm("program-edit");
  };

  const handleDeleteProgram = (programId) => {
    if (window.confirm("Are you sure you want to delete this program?")) {
      deleteProgram(programId);
      alert("Program deleted successfully!");
    }
  };

  const handleAdminToggleMilestone = (programId, milestoneId) => {
    adminToggleMilestoneComplete(programId, milestoneId);
    alert("Milestone completion status updated!");
  };

  const handleApproveJoin = (programId) => {
    approveJoinRequest(programId, 1);
    alert("Join request approved!");
  };

  const handleRejectJoin = (programId) => {
    rejectJoinRequest(programId, 1);
    alert("Join request rejected!");
  };

  // Filtered data (computed locally when needed)
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

  const filteredAttendance = attendance.filter(
    (a) =>
      a.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recentStudents
        .find((s) => s.id === a.studentId)
        ?.name.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const filteredRoadmapItems = roadmapItems.filter(
    (r) =>
      r.phase.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.term.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredClassMaterials = classMaterials.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPrograms = programs.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase())
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

      {/* Attendance Tab */}
      {activeTab === "attendance" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-white text-lg font-semibold flex items-center space-x-2">
              <UserCheck className="w-5 h-5 text-yellow-500" />
              <span>All Attendance Records</span>
            </h3>
            <button
              onClick={() => {
                setSelectedForm("attendance");
                setFormData({});
              }}
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg font-semibold"
            >
              New Attendance
            </button>
          </div>
          <input
            type="text"
            placeholder="Search attendance records..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
          />
          {filteredAttendance.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-12 border border-gray-700 text-center">
              <p className="text-gray-400 text-lg">No attendance records yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAttendance.map((record) => (
                <div
                  key={record.id}
                  className="bg-gray-800 rounded-lg p-6 border border-gray-700"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="text-white font-semibold text-lg mb-2">
                        {record.topic}
                      </h4>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-gray-400">
                          Date: {record.date}
                        </span>
                        <span className="text-gray-400">
                          Student:{" "}
                          {
                            recentStudents.find(
                              (s) => s.id === record.studentId
                            )?.name
                          }
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          record.status === "present"
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {record.status.toUpperCase()}
                      </span>
                      <button
                        onClick={() => handleEditAttendance(record)}
                        className="text-yellow-500 hover:text-yellow-400"
                        title="Edit Attendance"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteAttendance(record.id)}
                        className="text-red-500 hover:text-red-400"
                        title="Delete Attendance"
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

      {/* Roadmap Tab */}
      {activeTab === "roadmap" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-white text-lg font-semibold flex items-center space-x-2">
              <Map className="w-5 h-5 text-yellow-500" />
              <span>All Roadmap Items</span>
            </h3>
            <button
              onClick={() => {
                setSelectedForm("roadmap");
                setFormData({});
              }}
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg font-semibold"
            >
              New Roadmap Item
            </button>
          </div>
          <input
            type="text"
            placeholder="Search roadmap items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
          />
          {filteredRoadmapItems.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-12 border border-gray-700 text-center">
              <p className="text-gray-400 text-lg">No roadmap items yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRoadmapItems.map((roadmap) => (
                <div
                  key={roadmap.id}
                  className="bg-gray-800 rounded-lg p-6 border border-gray-700"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="text-white font-semibold text-lg mb-2">
                        {roadmap.phase} - {roadmap.term}
                      </h4>
                      <div className="flex items-center space-x-4 text-sm mb-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            roadmap.status === "completed"
                              ? "bg-green-500 text-white"
                              : roadmap.status === "in-progress"
                              ? "bg-blue-500 text-white"
                              : "bg-gray-500 text-white"
                          }`}
                        >
                          {roadmap.status.toUpperCase()}
                        </span>
                      </div>
                      {roadmap.weeks && roadmap.weeks.length > 0 && (
                        <div className="mt-4 space-y-3">
                          <h5 className="text-gray-400 text-sm font-semibold">
                            Weeks:
                          </h5>
                          {roadmap.weeks.map((week, weekIndex) => (
                            <div
                              key={weekIndex}
                              className="bg-gray-900 rounded-lg p-4 border border-gray-700"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <h6 className="text-white font-semibold">
                                  Week {week.weekNumber}: {week.topic}
                                </h6>
                                <button
                                  onClick={() =>
                                    handleSetCurrentWeek(roadmap.id, weekIndex)
                                  }
                                  className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                                    week.current
                                      ? "bg-yellow-500 text-gray-900"
                                      : "bg-gray-700 text-white hover:bg-gray-600"
                                  }`}
                                >
                                  {week.current
                                    ? "Current Week"
                                    : "Set as Current"}
                                </button>
                              </div>
                              {week.subTopics && week.subTopics.length > 0 && (
                                <div className="mt-3 space-y-2">
                                  {week.subTopics.map((subTopic) => (
                                    <div
                                      key={subTopic.id}
                                      className="flex items-center justify-between bg-gray-800 rounded-lg p-3"
                                    >
                                      <div className="flex items-center space-x-3">
                                        <input
                                          type="checkbox"
                                          checked={subTopic.completed}
                                          onChange={() =>
                                            handleToggleSubTopicComplete(
                                              roadmap.id,
                                              weekIndex,
                                              subTopic.id
                                            )
                                          }
                                          className="w-4 h-4"
                                        />
                                        <span
                                          className={`text-sm ${
                                            subTopic.completed
                                              ? "text-gray-500 line-through"
                                              : "text-white"
                                          }`}
                                        >
                                          {subTopic.name}
                                        </span>
                                      </div>
                                      <button
                                        onClick={() =>
                                          handleDeleteSubTopic(
                                            roadmap.id,
                                            weekIndex,
                                            subTopic.id
                                          )
                                        }
                                        className="text-red-500 hover:text-red-400"
                                        title="Delete Subtopic"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                              <button
                                onClick={() => {
                                  setSelectedForm("subtopic");
                                  setFormData({
                                    roadmapId: roadmap.id,
                                    weekIndex,
                                  });
                                }}
                                className="mt-3 w-full bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
                              >
                                Add Subtopic
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => {
                              setSelectedForm("week");
                              setFormData({ roadmapId: roadmap.id });
                            }}
                            className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                          >
                            Add Week
                          </button>
                        </div>
                      )}
                      {(!roadmap.weeks || roadmap.weeks.length === 0) && (
                        <button
                          onClick={() => {
                            setSelectedForm("week");
                            setFormData({ roadmapId: roadmap.id });
                          }}
                          className="mt-3 w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                        >
                          Add First Week
                        </button>
                      )}
                    </div>
                    <div className="flex items-center space-x-3 ml-4">
                      <button
                        onClick={() => handleEditRoadmapItem(roadmap)}
                        className="text-yellow-500 hover:text-yellow-400"
                        title="Edit Roadmap Item"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteRoadmapItem(roadmap.id)}
                        className="text-red-500 hover:text-red-400"
                        title="Delete Roadmap Item"
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

      {/* Class Materials Tab */}
      {activeTab === "classmaterials" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-white text-lg font-semibold flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-yellow-500" />
              <span>All Class Materials</span>
            </h3>
            <button
              onClick={() => {
                setSelectedForm("classmaterial");
                setFormData({});
              }}
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg font-semibold"
            >
              New Class Material
            </button>
          </div>
          <input
            type="text"
            placeholder="Search class materials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
          />
          {filteredClassMaterials.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-12 border border-gray-700 text-center">
              <p className="text-gray-400 text-lg">No class materials yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredClassMaterials.map((material) => (
                <div
                  key={material.id}
                  className="bg-gray-800 rounded-lg p-6 border border-gray-700"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <BookOpen className="w-6 h-6 text-yellow-500" />
                        <h4 className="text-white font-semibold text-lg">
                          {material.title}
                        </h4>
                      </div>
                      <span className="inline-block bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-xs font-semibold">
                        Week {material.week}
                      </span>
                      <span className="ml-2 inline-block bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-xs font-semibold">
                        {material.resources} resources
                      </span>
                      <div className="space-y-2 mt-4">
                        <p className="text-gray-400 text-sm font-semibold mb-2">
                          Topics Covered:
                        </p>
                        {material.topics.map((topic, idx) => (
                          <div
                            key={idx}
                            className="flex items-center space-x-2 text-gray-300"
                          >
                            <CheckCircle className="w-4 h-4 text-yellow-500" />
                            <span>{topic}</span>
                          </div>
                        ))}
                      </div>
                      {material.files && material.files.length > 0 && (
                        <div className="border-t border-gray-700 pt-4 mt-4">
                          <p className="text-gray-400 text-sm font-semibold mb-3">
                            Downloadable Files:
                          </p>
                          <div className="space-y-2">
                            {material.files.map((file, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between p-3 bg-gray-900 rounded-lg"
                              >
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-yellow-500 rounded flex items-center justify-center">
                                    <span className="text-gray-900 text-xs font-bold">
                                      {file.type}
                                    </span>
                                  </div>
                                  <div>
                                    <p className="text-white font-medium">
                                      {file.name}
                                    </p>
                                    <p className="text-gray-400 text-xs">
                                      {file.size}
                                    </p>
                                  </div>
                                </div>
                                <button className="text-yellow-500 hover:text-yellow-400 transition-colors">
                                  <Download className="w-5 h-5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-3 ml-4">
                      <button
                        onClick={() => handleEditClassMaterial(material)}
                        className="text-yellow-500 hover:text-yellow-400"
                        title="Edit Class Material"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteClassMaterial(material.id)}
                        className="text-red-500 hover:text-red-400"
                        title="Delete Class Material"
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

      {/* Programs Tab */}
      {activeTab === "programs" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-white text-lg font-semibold flex items-center space-x-2">
              <Briefcase className="w-5 h-5 text-yellow-500" />
              <span>All Programs</span>
            </h3>
            <button
              onClick={() => {
                setSelectedForm("program");
                setFormData({});
              }}
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg font-semibold"
            >
              New Program
            </button>
          </div>
          <input
            type="text"
            placeholder="Search programs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
          />
          {filteredPrograms.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-12 border border-gray-700 text-center">
              <p className="text-gray-400 text-lg">No programs yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPrograms.map((program) => {
                const completedMilestones =
                  program.milestones?.filter((m) => m.completed).length || 0;
                const total = program.totalMilestones || 0;
                const progress =
                  total > 0
                    ? ((completedMilestones / total) * 100).toFixed(0)
                    : 0;
                return (
                  <div
                    key={program.id}
                    className="bg-gray-800 rounded-lg p-6 border border-gray-700"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-white font-semibold text-lg mb-2">
                          {program.name}
                        </h4>
                        <p className="text-gray-400 text-sm mb-3">
                          {program.description}
                        </p>
                        <div className="mb-3">
                          <p className="text-gray-400 text-sm mb-2">
                            Progress: {completedMilestones}/{total} ({progress}
                            %)
                          </p>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                        {program.pendingRequests &&
                          program.pendingRequests.length > 0 && (
                            <div className="mb-4">
                              <p className="text-gray-400 text-sm font-semibold mb-2">
                                Pending Join Requests:
                              </p>
                              <div className="space-y-2">
                                {program.pendingRequests.map((studentId) => (
                                  <div
                                    key={studentId}
                                    className="flex items-center justify-between bg-yellow-900 p-2 rounded"
                                  >
                                    <span className="text-yellow-300 text-sm">
                                      Julius Dagana (ID: {studentId})
                                    </span>
                                    <div className="space-x-2">
                                      <button
                                        onClick={() =>
                                          handleApproveJoin(program.id)
                                        }
                                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs"
                                      >
                                        Approve
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleRejectJoin(program.id)
                                        }
                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                                      >
                                        Reject
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        {program.enrolledStudents &&
                          program.enrolledStudents.length > 0 && (
                            <div className="mb-4">
                              <p className="text-gray-400 text-sm font-semibold mb-2">
                                Enrolled Students:
                              </p>
                              <div className="space-y-1">
                                {program.enrolledStudents.map((studentId) => (
                                  <span
                                    key={studentId}
                                    className="inline-block bg-green-900 text-green-300 px-2 py-1 rounded text-xs"
                                  >
                                    Julius Dagana (ID: {studentId})
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        {program.milestones &&
                          program.milestones.length > 0 && (
                            <div className="mt-4 space-y-3">
                              <h5 className="text-gray-400 text-sm font-semibold">
                                Milestones:
                              </h5>
                              {program.milestones.map((milestone) => (
                                <div
                                  key={milestone.id}
                                  className="bg-gray-900 rounded-lg p-3"
                                >
                                  <div className="flex items-center justify-between">
                                    <span
                                      className={`text-sm ${
                                        milestone.completed
                                          ? "text-green-400 line-through"
                                          : "text-white"
                                      }`}
                                    >
                                      {milestone.name}
                                    </span>
                                    <div className="flex items-center space-x-2">
                                      <input
                                        type="checkbox"
                                        checked={milestone.completed}
                                        onChange={() =>
                                          handleAdminToggleMilestone(
                                            program.id,
                                            milestone.id
                                          )
                                        }
                                        className="w-4 h-4"
                                      />
                                      <span
                                        className={`px-2 py-1 rounded-full text-xs ${
                                          milestone.completed
                                            ? "bg-green-500 text-white"
                                            : "bg-gray-500 text-white"
                                        }`}
                                      >
                                        {milestone.completed
                                          ? "Completed"
                                          : "Pending"}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        {(!program.milestones ||
                          program.milestones.length === 0) && (
                          <button
                            onClick={() => {
                              setSelectedForm("milestone");
                              setFormData({ programId: program.id });
                            }}
                            className="mt-3 w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                          >
                            Add First Milestone
                          </button>
                        )}
                        {program.milestones &&
                          program.milestones.length <
                            program.totalMilestones && (
                            <button
                              onClick={() => {
                                setSelectedForm("milestone");
                                setFormData({ programId: program.id });
                              }}
                              className="mt-3 w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                            >
                              Add Milestone
                            </button>
                          )}
                      </div>
                      <div className="flex items-center space-x-3 ml-4">
                        <button
                          onClick={() => handleEditProgram(program)}
                          className="text-yellow-500 hover:text-yellow-400"
                          title="Edit Program"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProgram(program.id)}
                          className="text-red-500 hover:text-red-400"
                          title="Delete Program"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Admi;
