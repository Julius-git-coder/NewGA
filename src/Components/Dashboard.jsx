// Dashboard.jsx - Student Dashboard Component with Firebase Integration
import React, { useState, useEffect, useMemo } from "react";
import {
  Home,
  Users,
  Bell,
  FileText,
  FolderOpen,
  Dumbbell,
  UserCheck,
  Award,
  Code,
  Map,
  BookOpen,
  BookMarked,
  Calendar,
  Briefcase,
  User,
  Menu,
  X,
  MessageSquare,
} from "lucide-react";
import { auth } from "../src/Service/FirebaseConfig";
import useManageStore from "../Store/useManageStore";

// Import all page components
import Announcement from "../../Pages/Announcement";
import Assignments from "../../Pages/Assignments";
import Attendance from "../../Pages/Attendance";
import Projects from "../../Pages/Projects";
import Exercises from "../../Pages/Exercises";
import Grading from "../../Pages/Grading";
import DaysOfLearning from "../../Pages/DaysOfLearning";
import RoadMap from "../../Pages/RoadMap";
import ClassMaterials from "../../Pages/ClassMaterials";
import Directory from "../../Pages/Directory";
import BookSession from "../../Pages/BookSections";
import WorkReady from "../../Pages/WorkReady";
import Profile from "../../Pages/Profile";
import CampusConnect from "../../Pages/CampusConnect";

// ChatModal Component
const ChatModal = ({ onClose, otherUser, currentUser }) => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { conversations, addMessage, directory } = useManageStore();
  const markNotificationAsRead = useManageStore(
    (state) => state.markNotificationAsRead
  );

  const convKey = [
    Math.min(currentUser.id, otherUser.id),
    Math.max(currentUser.id, otherUser.id),
  ].join("-");

  useEffect(() => {
    setMessages(conversations[convKey] || []);
  }, [conversations, convKey]);

  // Mark unread notifications from this user as read when chat opens
  useEffect(() => {
    const state = useManageStore.getState();
    const unreadNotifs = state.notifications.filter(
      (n) =>
        n.userId === currentUser.id &&
        !n.read &&
        n.fromUserId === otherUser.id &&
        n.type === "message"
    );
    unreadNotifs.forEach((notif) => {
      markNotificationAsRead(notif.id);
    });
  }, [currentUser.id, otherUser.id, markNotificationAsRead]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const timestamp = new Date().toISOString();
      const messageId = Date.now().toString();

      addMessage(
        currentUser.id,
        otherUser.id,
        currentUser.id,
        newMessage,
        timestamp,
        messageId
      );
      setNewMessage("");
    }
  };

  const otherUserProfile = directory.find((u) => u.id === otherUser.id);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 w-full h-full max-w-4xl rounded-lg flex flex-col">
        {/* Header */}
        <div className="bg-gray-700 p-4 flex items-center justify-between border-b border-gray-600">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
              {otherUserProfile?.pictureUrl ? (
                <img
                  src={otherUserProfile.pictureUrl}
                  alt={otherUser.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-5 h-5 text-gray-300" />
              )}
            </div>
            <div>
              <h3 className="text-white font-semibold">{otherUser.name}</h3>
              <p className="text-gray-400 text-sm">{otherUser.role}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.senderId === currentUser.id
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.senderId === currentUser.id
                    ? "bg-yellow-500 text-gray-900"
                    : "bg-gray-700 text-white"
                }`}
              >
                <p>{msg.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    msg.senderId === currentUser.id
                      ? "text-yellow-700"
                      : "text-gray-400"
                  }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <form
          onSubmit={handleSendMessage}
          className="p-4 border-t border-gray-600"
        >
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2 outline-none"
            />
            <button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg font-semibold"
            >
              <MessageSquare className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Notification Modal Component
const NotificationModal = ({
  isOpen,
  onClose,
  userId,
  directory,
  conversations,
  markNotificationAsRead,
  onOpenChat,
  sessions,
  announcements,
  assignments,
  exercises,
  projects,
  attendance,
  roadmapItems,
  classMaterials,
  programs,
}) => {
  if (!isOpen) return null;

  const notifications = useManageStore
    .getState()
    .notifications.filter((n) => n.userId === userId && !n.read)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  if (notifications.length === 0) {
    return (
      <div className="fixed right-4 top-20 w-80 bg-gray-800 rounded-lg shadow-lg z-50 border border-gray-700">
        <div className="p-4 border-b border-gray-600">
          <h3 className="text-white font-semibold">Notifications</h3>
        </div>
        <div className="p-4 text-gray-400 text-center">
          No new notifications
        </div>
        <button
          onClick={onClose}
          className="w-full p-2 hover:bg-gray-700 text-gray-300"
        >
          Close
        </button>
      </div>
    );
  }

  const handleNotificationClick = (notif) => {
    markNotificationAsRead(notif.id);
    onClose();

    if (notif.type === "message") {
      const sender = directory.find((u) => u.id === notif.fromUserId);
      if (sender && onOpenChat) {
        onOpenChat(sender);
      }
    } else if (notif.type.startsWith("session_")) {
      const session = sessions.find((s) => s.id === notif.sessionId);
      if (notif.type === "session_started" && session && session.zoomLink) {
        window.open(session.zoomLink, "_blank");
      } else if (notif.type === "session_approved") {
        alert("Session approved! Wait for the start time to join the meeting.");
      } else if (notif.type === "session_rejected") {
        alert("Session rejected. Please book a new one if needed.");
      }
    } else {
      alert(`${notif.message}`);
    }
  };

  return (
    <div className="fixed right-4 top-20 w-80 bg-gray-800 rounded-lg shadow-lg z-50 border border-gray-700 max-h-96 overflow-y-auto">
      <div className="p-4 border-b border-gray-600 flex justify-between items-center">
        <h3 className="text-white font-semibold">
          Notifications ({notifications.length})
        </h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="divide-y divide-gray-700">
        {notifications.map((notif) => {
          const sender = directory.find((u) => u.id === notif.fromUserId);
          const admin = directory.find((u) => u.id === 2);

          return (
            <div
              key={notif.id}
              className="p-4 hover:bg-gray-700 cursor-pointer"
              onClick={() => handleNotificationClick(notif)}
            >
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {sender?.pictureUrl || admin?.pictureUrl ? (
                    <img
                      src={sender?.pictureUrl || admin?.pictureUrl}
                      alt={sender?.name || "Admin"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-4 h-4 text-gray-300" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">
                    {sender?.name || "System Update"}
                  </p>
                  <p className="text-gray-300 text-sm truncate">
                    {notif.message}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    {new Date(notif.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Sidebar Component
const Sidebar = ({
  activeTab,
  setActiveTab,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) => {
  const menuItems = [
    { id: "dashboard", icon: Home, label: "Dashboard" },
    { id: "connect", icon: Users, label: "Campus Connect" },
    { id: "announcements", icon: Bell, label: "Announcements" },
    { id: "assignments", icon: FileText, label: "Assignments" },
    { id: "projects", icon: FolderOpen, label: "Projects" },
    { id: "exercises", icon: Dumbbell, label: "Exercises" },
    { id: "attendance", icon: UserCheck, label: "Attendance" },
    { id: "grading", icon: Award, label: "Grading" },
    { id: "100days", icon: Code, label: "100 Days To BECE" },
    { id: "roadmap", icon: Map, label: "Roadmap" },
    { id: "materials", icon: BookOpen, label: "Class Materials" },
    { id: "directory", icon: BookMarked, label: "Directory" },
    { id: "session", icon: Calendar, label: "Book a Session" },
    { id: "workready", icon: Briefcase, label: "Available Programs" },
    { id: "profile", icon: User, label: "Profile" },
  ];

  return (
    <div
      className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-900 transform ${
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 transition-transform duration-300 ease-in-out`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5 text-gray-900" />
            </div>
            <div>
              <h1 className="text-white font-bold text-sm">
                GradeA<span className="absolute top-2">+</span>
              </h1>
            </div>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden text-gray-400"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-6 py-3 text-left transition-colors ${
                  activeTab === item.id
                    ? "bg-gray-800 text-white border-l-4 border-yellow-500"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

// Progress Card Component
const ProgressCard = ({
  title,
  icon: Icon,
  current,
  total,
  color = "bg-yellow-500",
  onClick,
}) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div
      className={`bg-gray-800 rounded-lg p-6 border border-gray-700 transition-colors ${
        onClick ? "cursor-pointer hover:bg-gray-700" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex items-start space-x-3 mb-4">
        <Icon className="w-6 h-6 text-gray-400 flex-shrink-0 mt-0.5" />
        <h3 className="text-white font-semibold flex-1 min-w-0 break-words">
          {title}
        </h3>
      </div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-400 text-sm">Progress</span>
        <span className="text-gray-300 text-sm">
          {current} / {total} pts
        </span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-3">
        <div
          className={`${color} h-3 rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// Overall Progress Component
const OverallProgress = ({ current, total }) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
      <div className="flex items-center space-x-3 mb-4">
        <Award className="w-8 h-8 text-yellow-500" />
        <div>
          <h2 className="text-white text-2xl font-bold">Overall Progress</h2>
          <p className="text-gray-400 text-sm">
            You have earned {current} out of {total} possible points.
          </p>
        </div>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-4">
        <div
          className="bg-yellow-500 h-4 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// Welcome Section Component
const WelcomeSection = ({
  studentProfile,
  currentWeekData,
  nextWeekData,
  setActiveTab,
}) => {
  const handleRoadmapClick = () => setActiveTab("roadmap");

  return (
    <div className="mb-8">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
          {studentProfile?.pictureUrl ? (
            <img
              src={studentProfile.pictureUrl}
              alt="Profile"
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <User className="w-8 h-8 text-gray-400" />
          )}
        </div>
        <div>
          <h1 className="text-white text-3xl font-bold">
            Welcome back, {studentProfile?.name || "Student"}!
          </h1>
          <p className="text-gray-400">Here's your overview for today.</p>
        </div>
      </div>

      {currentWeekData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div
            className="bg-gray-800 rounded-lg p-6 border border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors"
            onClick={handleRoadmapClick}
          >
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
              <h3 className="text-white font-semibold text-lg">
                This Week's Focus
              </h3>
            </div>
            <div className="inline-block bg-yellow-500 text-gray-900 px-3 py-1 rounded-full text-xs font-semibold mb-4">
              {currentWeekData.phase} - {currentWeekData.term} - Week{" "}
              {currentWeekData.weekNumber}
            </div>
            <ul className="space-y-3">
              {currentWeekData.subTopics?.slice(0, 3).map((sub, idx) => (
                <li
                  key={idx}
                  className="flex items-center space-x-2 text-gray-300"
                >
                  <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-gray-900 text-xs">✓</span>
                  </div>
                  <span>{sub.name}</span>
                </li>
              ))}
            </ul>
          </div>

          {nextWeekData && (
            <div
              className="bg-gray-800 rounded-lg p-6 border border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors"
              onClick={handleRoadmapClick}
            >
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 text-gray-400">⏰</div>
                <h3 className="text-white font-semibold text-lg">
                  Next Week's Topics
                </h3>
              </div>
              <div className="inline-block bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-xs font-semibold mb-4">
                {nextWeekData.phase} - {nextWeekData.term} - Week{" "}
                {nextWeekData.weekNumber}
              </div>
              <ul className="space-y-3">
                {nextWeekData.subTopics?.slice(0, 2).map((sub, idx) => (
                  <li
                    key={idx}
                    className="flex items-center space-x-2 text-gray-400"
                  >
                    <div className="w-5 h-5 border-2 border-gray-600 rounded-full" />
                    <span>{sub.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Recent Updates Component
const RecentUpdates = ({ setActiveTab }) => {
  const {
    announcements,
    assignments,
    exercises,
    projects,
    sessions,
    classMaterials,
    daysOfLearning,
    roadmapItems,
  } = useManageStore();

  const studentId = 1;

  const recentAnnouncements = announcements.slice(0, 2);

  const pendingAssignments = assignments
    .filter((a) => a.studentId === studentId && a.status !== "graded")
    .map((a) => ({ ...a, type: "assignment" }))
    .slice(0, 1);

  const pendingExercises = exercises
    .filter((e) => e.studentId === studentId && e.status !== "graded")
    .map((e) => ({ ...e, type: "exercise" }))
    .slice(0, 1);

  const pendingProjects = projects
    .filter((p) => p.studentId === studentId && p.status !== "graded")
    .map((p) => ({ ...p, type: "project" }))
    .slice(0, 1);

  const recentTasks = [
    ...pendingAssignments,
    ...pendingExercises,
    ...pendingProjects,
  ].slice(0, 3);

  const now = new Date();
  const upcomingSessions = sessions
    .filter(
      (s) =>
        s.studentId === studentId &&
        (s.status === "approved" || s.status === "started") &&
        new Date(`${s.date}T${s.time}:00`) > now
    )
    .slice(0, 2);

  const recentMaterials = classMaterials.slice(-1);
  const daysProgress = `${daysOfLearning.completedDays} / ${daysOfLearning.totalDays} days`;

  const currentRoadmapWeek =
    roadmapItems
      .flatMap(
        (item) => item.weeks?.filter((w) => w.current && !w.passed) || []
      )
      .slice(0, 1)[0]?.topic || "No current week";

  const handleTaskClick = (task) => {
    const tabMap = {
      assignment: "assignments",
      exercise: "exercises",
      project: "projects",
    };
    setActiveTab(tabMap[task.type] || "assignments");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Recent Announcements */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-white font-semibold text-lg mb-4 flex items-center space-x-2">
          <Bell className="w-5 h-5 text-yellow-500" />
          <span>Recent Announcements</span>
        </h3>
        {recentAnnouncements.length > 0 ? (
          <div className="space-y-3">
            {recentAnnouncements.map((ann) => (
              <div
                key={ann.id}
                className="text-sm cursor-pointer hover:text-yellow-400 transition-colors"
                onClick={() => setActiveTab("announcements")}
              >
                <p className="text-gray-300 font-medium">{ann.title}</p>
                <p className="text-gray-500">{ann.content.slice(0, 50)}...</p>
                <p className="text-xs text-gray-400 mt-1">{ann.date}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No recent announcements.</p>
        )}
      </div>

      {/* Recent Tasks */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-white font-semibold text-lg mb-4 flex items-center space-x-2">
          <FileText className="w-5 h-5 text-yellow-500" />
          <span>Pending Tasks</span>
        </h3>
        {recentTasks.length > 0 ? (
          <div className="space-y-2">
            {recentTasks.map((task) => (
              <div
                key={task.id}
                className="text-sm border-b border-gray-700 pb-2 cursor-pointer hover:text-yellow-400 transition-colors"
                onClick={() => handleTaskClick(task)}
              >
                <p className="text-gray-300">{task.title}</p>
                <p className="text-xs text-gray-500">
                  Due: {task.dueDate || "No due date"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No pending tasks.</p>
        )}
      </div>

      {/* Upcoming Sessions */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-white font-semibold text-lg mb-4 flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-yellow-500" />
          <span>Upcoming Sessions</span>
        </h3>
        {upcomingSessions.length > 0 ? (
          <div className="space-y-2">
            {upcomingSessions.map((session) => (
              <div
                key={session.id}
                className="text-sm cursor-pointer hover:text-yellow-400 transition-colors"
                onClick={() => setActiveTab("session")}
              >
                <p className="text-gray-300">{session.title}</p>
                <p className="text-xs text-gray-500">
                  {session.date} at {session.time}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No upcoming sessions.</p>
        )}
      </div>

      {/* Learning Progress */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-white font-semibold text-lg mb-4 flex items-center space-x-2">
          <Code className="w-5 h-5 text-yellow-500" />
          <span>Learning Progress</span>
        </h3>
        <div className="space-y-2 text-sm">
          <p
            className="text-gray-300 cursor-pointer hover:text-yellow-400 transition-colors"
            onClick={() => setActiveTab("100days")}
          >
            100 Days: {daysProgress}
          </p>
          <p
            className="text-gray-300 cursor-pointer hover:text-yellow-400 transition-colors"
            onClick={() => setActiveTab("roadmap")}
          >
            Current Week: {currentRoadmapWeek}
          </p>
          {recentMaterials.length > 0 && (
            <p
              className="text-gray-500 cursor-pointer hover:text-yellow-400 transition-colors"
              onClick={() => setActiveTab("materials")}
            >
              New Material: {recentMaterials[0].title}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// Performance Hub Component
const PerformanceHub = ({ setActiveTab }) => {
  const { attendance, assignments, exercises, projects, programs } =
    useManageStore();

  const studentId = 1;

  const studentAttendance = attendance.filter((a) => a.studentId === studentId);
  const presentAttendance = studentAttendance.filter(
    (a) => a.status === "present"
  );
  const attendanceCurrent = presentAttendance.length;
  const attendanceTotal = studentAttendance.length;

  const studentAssignments = assignments.filter(
    (a) => a.studentId === studentId
  );
  const gradedAssignments = studentAssignments.filter(
    (a) => a.status === "graded"
  );
  const assignmentsCurrent = gradedAssignments.reduce(
    (sum, a) => sum + (a.grade || 0),
    0
  );
  const assignmentsTotal = studentAssignments.reduce(
    (sum, a) => sum + a.points,
    0
  );

  const studentExercises = exercises.filter((e) => e.studentId === studentId);
  const gradedExercises = studentExercises.filter((e) => e.status === "graded");
  const exercisesCurrent = gradedExercises.reduce(
    (sum, e) => sum + (e.grade || 0),
    0
  );
  const exercisesTotal = studentExercises.reduce((sum, e) => sum + e.points, 0);

  const studentProjects = projects.filter((p) => p.studentId === studentId);
  const gradedProjects = studentProjects.filter((p) => p.status === "graded");
  const projectsCurrent = gradedProjects.reduce(
    (sum, p) => sum + (p.grade || 0),
    0
  );
  const projectsTotal = studentProjects.reduce((sum, p) => sum + p.points, 0);

  const enrolledPrograms = programs.filter((p) =>
    p.enrolledStudents?.includes(studentId)
  );
  const softSkillsCurrent = enrolledPrograms.reduce((sum, p) => {
    return sum + (p.milestones?.filter((m) => m.completed).length || 0);
  }, 0);
  const softSkillsTotal =
    enrolledPrograms.reduce((sum, p) => sum + (p.totalMilestones || 0), 0) || 6;

  const overallCurrent =
    attendanceCurrent +
    assignmentsCurrent +
    exercisesCurrent +
    projectsCurrent +
    softSkillsCurrent;
  const overallTotal =
    attendanceTotal +
    assignmentsTotal +
    exercisesTotal +
    projectsTotal +
    softSkillsTotal;

  return (
    <div className="mb-8">
      <div className="flex items-center space-x-2 mb-6">
        <Award className="w-6 h-6 text-yellow-500" />
        <h2 className="text-white text-2xl font-bold">Performance Hub</h2>
      </div>
      <p className="text-gray-400 mb-6">
        Your academic points breakdown and progress.
      </p>
      <OverallProgress current={overallCurrent} total={overallTotal} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProgressCard
          title="Class Attendance"
          icon={UserCheck}
          current={attendanceCurrent}
          total={attendanceTotal}
          onClick={() => setActiveTab("attendance")}
        />
        <ProgressCard
          title="Class Assignments"
          icon={FileText}
          current={assignmentsCurrent}
          total={assignmentsTotal}
          onClick={() => setActiveTab("assignments")}
        />
        <ProgressCard
          title="Class Exercises"
          icon={Dumbbell}
          current={exercisesCurrent}
          total={exercisesTotal}
          onClick={() => setActiveTab("exercises")}
        />
        <ProgressCard
          title="Projects"
          icon={FolderOpen}
          current={projectsCurrent}
          total={projectsTotal}
          onClick={() => setActiveTab("projects")}
        />
        <ProgressCard
          title="Soft Skills & Product Training"
          icon={Award}
          current={softSkillsCurrent}
          total={softSkillsTotal}
          color="bg-blue-500"
          onClick={() => setActiveTab("workready")}
        />
      </div>
    </div>
  );
};

// Dashboard Content Component
const DashboardContent = ({ setActiveTab }) => {
  const { directory, roadmapItems } = useManageStore();
  const studentId = 1;

  const studentProfile = useMemo(
    () => directory.find((u) => u.id === studentId),
    [directory]
  );

  let currentWeekData = null;
  let nextWeekData = null;

  roadmapItems.forEach((item) => {
    if (item.weeks) {
      const currentWeekIndex = item.weeks.findIndex(
        (w) => w.current && !w.passed
      );
      if (currentWeekIndex !== -1) {
        currentWeekData = {
          phase: item.phase,
          term: item.term,
          weekNumber: item.weeks[currentWeekIndex].weekNumber,
          subTopics: item.weeks[currentWeekIndex].subTopics || [],
        };
      }
      const nextWeekIndex = item.weeks.findIndex((w) => w.next && !w.passed);
      if (nextWeekIndex !== -1) {
        nextWeekData = {
          phase: item.phase,
          term: item.term,
          weekNumber: item.weeks[nextWeekIndex].weekNumber,
          subTopics: item.weeks[nextWeekIndex].subTopics || [],
        };
      }
    }
  });

  return (
    <div>
      <WelcomeSection
        studentProfile={studentProfile}
        currentWeekData={currentWeekData}
        nextWeekData={nextWeekData}
        setActiveTab={setActiveTab}
      />
      <PerformanceHub setActiveTab={setActiveTab} />
      <RecentUpdates setActiveTab={setActiveTab} />
    </div>
  );
};

// Main Dashboard Component
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const markNotificationAsRead = useManageStore(
    (state) => state.markNotificationAsRead
  );

  const {
    directory,
    conversations,
    sessions,
    announcements,
    assignments,
    exercises,
    projects,
    attendance,
    roadmapItems,
    classMaterials,
    programs,
  } = useManageStore();

  const studentId = 1;
  const currentUser = { id: 1, name: "Julius Dagana" };

  const studentProfile = useMemo(
    () => directory.find((u) => u.id === studentId),
    [directory]
  );

  const handleBellClick = () => {
    setIsNotificationOpen(true);
  };

  const handleOpenChatFromNotification = (sender) => {
    setSelectedUser(sender);
    setIsChatOpen(true);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardContent setActiveTab={setActiveTab} />;
      case "connect":
        return <CampusConnect />;
      case "announcements":
        return <Announcement />;
      case "assignments":
        return <Assignments />;
      case "projects":
        return <Projects />;
      case "exercises":
        return <Exercises />;
      case "attendance":
        return <Attendance />;
      case "grading":
        return <Grading />;
      case "100days":
        return <DaysOfLearning />;
      case "roadmap":
        return <RoadMap />;
      case "materials":
        return <ClassMaterials />;
      case "directory":
        return <Directory />;
      case "session":
        return <BookSession />;
      case "workready":
        return <WorkReady />;
      case "profile":
        return <Profile />;
      default:
        return <DashboardContent setActiveTab={setActiveTab} />;
    }
  };

  const unreadCount = useManageStore
    .getState()
    .notifications.filter((n) => n.userId === studentId && !n.read).length;

  return (
    <div className="flex h-screen bg-gray-900">
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center space-x-4 ml-auto">
              <button
                onClick={handleBellClick}
                className="relative text-gray-400 hover:text-white"
              >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center transform translate-x-1/2 -translate-y-1/2">
                    {unreadCount}
                  </span>
                )}
              </button>
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
                {studentProfile?.pictureUrl ? (
                  <img
                    src={studentProfile.pictureUrl}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <User className="w-6 h-6 text-gray-400" />
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">{renderContent()}</main>
      </div>

      {isChatOpen && selectedUser && (
        <ChatModal
          onClose={() => setIsChatOpen(false)}
          otherUser={selectedUser}
          currentUser={currentUser}
        />
      )}

      <NotificationModal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        userId={studentId}
        directory={directory}
        conversations={conversations}
        markNotificationAsRead={markNotificationAsRead}
        onOpenChat={handleOpenChatFromNotification}
        sessions={sessions}
        announcements={announcements}
        assignments={assignments}
        exercises={exercises}
        projects={projects}
        attendance={attendance}
        roadmapItems={roadmapItems}
        classMaterials={classMaterials}
        programs={programs}
      />
    </div>
  );
};

export default Dashboard;
