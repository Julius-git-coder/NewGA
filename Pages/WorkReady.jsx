// Complete fixed WorkReady.jsx
import React from "react";
import {
  Briefcase,
  FileText,
  Target,
  TrendingUp,
  CheckCircle,
  Award,
} from "lucide-react";
import useManageStore from "../src/Store/useManageStore";

const WorkReady = () => {
  const { workReadyResources, programs, addNotification } = useManageStore();
  const studentId = 1; // Hardcoded for demo

  const availablePrograms = programs.filter(
    (p) =>
      !p.enrolledStudents?.includes(studentId) &&
      !p.pendingRequests?.includes(studentId)
  );
  const joinedPrograms = programs.filter((p) =>
    p.enrolledStudents?.includes(studentId)
  );
  const pendingPrograms = programs.filter((p) =>
    p.pendingRequests?.includes(studentId)
  );

  const requestJoinProgram = useManageStore(
    (state) => state.requestJoinProgram
  );

  const skills = workReadyResources.map((r) => ({
    name: r.title,
    completed: r.status === "completed",
    progress: r.progress || 0,
  }));

  const resources = workReadyResources;

  const handleJoinProgram = (programId) => {
    requestJoinProgram(programId, studentId);
    // FIXED: Add self-notification for student
    const program = programs.find((p) => p.id === programId);
    const newNotifForStudent = {
      id: Date.now() + 1,
      userId: studentId,
      type: "program_join_requested_self",
      programId,
      message: `Join request sent for "${program?.name}"`,
      read: false,
      timestamp: new Date().toISOString(),
    };
    addNotification(newNotifForStudent);
    alert("Join request sent! Waiting for admin approval.");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-white text-3xl font-bold">Skills Ready Program</h1>
        <p className="text-gray-400 mt-2">Prepare for your career in tech</p>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex justify-between space-x-4 mb-4">
          <Briefcase className="w-10 h-10 text-yellow-500" />
          <h3 className="text-white text-lg font-semibold mb-4 flex items-center space-x-2">
            <Target className="w-5 h-5 text-yellow-500" />
            <span>Career Skills</span>
          </h3>
        </div>

        <div className="space-y-4">
          {skills.map((skill, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {skill.completed ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <div className="w-5 h-5 border-2 border-gray-600 rounded-full" />
                  )}
                  <span className="text-white">{skill.name}</span>
                </div>
                <span className="text-gray-400 text-sm">{skill.progress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    skill.completed ? "bg-green-500" : "bg-yellow-500"
                  }`}
                  style={{ width: `${skill.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Programs */}
      {pendingPrograms.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-white text-lg font-semibold mb-4 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-yellow-500" />
            <span>Pending Program Requests</span>
          </h3>
          <div className="space-y-3">
            {pendingPrograms.map((program) => (
              <div
                key={program.id}
                className="bg-gray-900 rounded-lg p-4 border border-gray-700"
              >
                <h4 className="text-white font-semibold">{program.name}</h4>
                <p className="text-gray-400 text-sm">{program.description}</p>
                <span className="bg-yellow-500 text-gray-900 px-2 py-1 rounded text-xs font-semibold mt-2 inline-block">
                  Pending Approval
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Programs */}
      {availablePrograms.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-white text-lg font-semibold mb-4 flex items-center space-x-2">
            <Target className="w-5 h-5 text-yellow-500" />
            <span>Available Programs</span>
          </h3>
          <div className="space-y-3">
            {availablePrograms.map((program) => (
              <div
                key={program.id}
                className="bg-gray-900 rounded-lg p-4 border border-gray-700"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="text-white font-semibold">{program.name}</h4>
                    <p className="text-gray-400 text-sm">
                      {program.description}
                    </p>
                  </div>
                  <button
                    onClick={() => handleJoinProgram(program.id)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg font-semibold transition-colors text-sm ml-4"
                  >
                    Join Program
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Joined Programs */}
      {joinedPrograms.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {joinedPrograms.map((program) => {
            const completedMilestones =
              program.milestones?.filter((m) => m.completed).length || 0;
            const total = program.totalMilestones || 0;
            const progress =
              total > 0 ? ((completedMilestones / total) * 100).toFixed(0) : 0;
            return (
              <div
                key={program.id}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700"
              >
                <div className="mb-4">
                  <h3 className="text-white text-lg font-semibold flex items-center space-x-2">
                    <Award className="w-5 h-5 text-yellow-500" />
                    <span>{program.name}</span>
                  </h3>
                  <p className="text-gray-400 mb-3">{program.description}</p>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-yellow-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-gray-400 text-sm mt-1">
                    {completedMilestones}/{total} Milestones Completed
                  </p>
                </div>
                <div className="space-y-3">
                  {program.milestones?.map((milestone) => (
                    <div
                      key={milestone.id}
                      className="bg-gray-900 rounded-lg p-3 border border-gray-700"
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
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            milestone.completed
                              ? "bg-green-500 text-white"
                              : "bg-gray-500 text-white"
                          }`}
                        >
                          {milestone.completed ? "Completed" : "Pending"}
                        </span>
                      </div>
                    </div>
                  )) || (
                    <p className="text-gray-400 text-sm">No milestones yet.</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Legacy Skills and Resources */}
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="space-y-3">
            {resources.map((resource, index) => (
              <div
                key={index}
                className="bg-gray-900 rounded-lg p-4 border border-gray-700"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-white font-semibold">{resource.title}</h4>
                  <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs font-semibold">
                    {resource.type}
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-3">
                  {resource.description}
                </p>
                <button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg font-semibold transition-colors text-sm">
                  Access Resource
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {joinedPrograms.length === 0 && availablePrograms.length === 0 && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 text-center">
          <p className="text-gray-400 text-lg">
            No programs available yet. Check back later!
          </p>
        </div>
      )}
    </div>
  );
};
export default WorkReady;
