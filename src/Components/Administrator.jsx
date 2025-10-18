import React, { useState, useEffect, useMemo } from "react";
import {
  Users,
  BookOpen,
  TrendingUp,
  MessageSquare,
  X,
  User,
  Mail,
  Bell,
  Calendar,
  Clock,
  Map,
  Briefcase,
} from "lucide-react";
import useManageStore from "../Store/useManageStore";
import Admini from "./Admini";
import Administra from "./Administra";
import Adminis from "./Adminis";
// Updated Sessions Management Section Component
const SessionsManagement = ({
  directory,
  approveSession,
  rejectSession,
  startSession,
  deleteSession,
}) => {
  const [activeSubTab, setActiveSubTab] = useState("pending"); // pending, approved, all
  const [zoomLinkInput, setZoomLinkInput] = useState({});
  const sessions = useManageStore((state) => state.sessions);
  // Filter sessions
  const pendingSessions = sessions.filter((s) => s.status === "pending");
  const approvedSessions = sessions.filter((s) => s.status === "approved");
  const allSessions = sessions;
  const currentSessions =
    activeSubTab === "pending"
      ? pendingSessions
      : activeSubTab === "approved"
      ? approvedSessions
      : allSessions;
  const handleStartSession = (sessionId, sessionDate, sessionTime) => {
    const sessionTimeDate = new Date(`${sessionDate}T${sessionTime}:00`);
    const now = new Date();
    if (now >= sessionTimeDate) {
      startSession(sessionId);
      alert("Session started! Zoom link generated.");
    } else {
      alert(`Session starts at ${sessionTime}. Please wait.`);
    }
  };
  const handleApproveSession = (sessionId) => {
    const zoomLink = zoomLinkInput[sessionId] || "";
    if (!zoomLink) {
      alert("Please enter a Zoom link.");
      return;
    }
    if (!/https?:\/\/[^\s]+/.test(zoomLink)) {
      alert("Please enter a valid Zoom link.");
      return;
    }
    approveSession(sessionId, zoomLink);
    setZoomLinkInput((prev) => ({ ...prev, [sessionId]: "" }));
    alert("Session approved! Notification sent to student.");
  };
  const getStudentName = (studentId) => {
    const student = directory.find((u) => u.id === studentId);
    return student ? student.name : "Unknown Student";
  };
  return (
    <div className="mt-8">
      <h2 className="text-white text-2xl font-bold mb-6">Session Management</h2>
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveSubTab("pending")}
          className={`px-4 py-2 rounded-lg ${
            activeSubTab === "pending"
              ? "bg-yellow-500 text-gray-900"
              : "bg-gray-700 text-gray-300"
          }`}
        >
          Pending ({pendingSessions.length})
        </button>
        <button
          onClick={() => setActiveSubTab("approved")}
          className={`px-4 py-2 rounded-lg ${
            activeSubTab === "approved"
              ? "bg-yellow-500 text-gray-900"
              : "bg-gray-700 text-gray-300"
          }`}
        >
          Approved ({approvedSessions.length})
        </button>
        <button
          onClick={() => setActiveSubTab("all")}
          className={`px-4 py-2 rounded-lg ${
            activeSubTab === "all"
              ? "bg-yellow-500 text-gray-900"
              : "bg-gray-700 text-gray-300"
          }`}
        >
          All Sessions
        </button>
      </div>
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        {currentSessions.length === 0 ? (
          <p className="text-gray-400 text-center">No sessions found.</p>
        ) : (
          <div className="space-y-4">
            {currentSessions.map((session) => {
              const studentName = getStudentName(session.studentId);
              const isTimeReached = () => {
                const sessionTimeDate = new Date(
                  `${session.date}T${session.time}:00`
                );
                return new Date() >= sessionTimeDate;
              };
              return (
                <div
                  key={session.id}
                  className="bg-gray-900 rounded-lg p-4 border border-gray-700 flex items-start justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-white font-semibold">
                        {session.title}
                      </h4>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          session.status === "pending"
                            ? "bg-yellow-500 text-gray-900"
                            : session.status === "approved"
                            ? "bg-green-500 text-white"
                            : session.status === "started"
                            ? "bg-blue-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {session.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-400 mb-2">Student: {studentName}</p>
                    <div className="space-y-1 text-sm text-gray-400">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{session.date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>
                          {session.time} ({session.duration})
                        </span>
                      </div>
                      {session.notes && <p>Notes: {session.notes}</p>}
                      {session.zoomLink && (
                        <p className="text-blue-400">
                          Zoom:{" "}
                          <a
                            href={session.zoomLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {session.zoomLink}
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2 ml-4 flex-shrink-0">
                    {session.status === "pending" && (
                      <>
                        <input
                          type="text"
                          value={zoomLinkInput[session.id] || ""}
                          onChange={(e) =>
                            setZoomLinkInput((prev) => ({
                              ...prev,
                              [session.id]: e.target.value,
                            }))
                          }
                          placeholder="Enter Zoom link"
                          className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-1 text-sm"
                        />
                        <button
                          onClick={() => handleApproveSession(session.id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm w-full"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => rejectSession(session.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm w-full"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {session.status === "approved" && (
                      <button
                        onClick={() =>
                          handleStartSession(
                            session.id,
                            session.date,
                            session.time
                          )
                        }
                        disabled={!isTimeReached()}
                        className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white px-3 py-1 rounded text-sm w-full"
                      >
                        {isTimeReached() ? "Start" : "Wait for Time"}
                      </button>
                    )}
                    {session.status === "started" && (
                      <a
                        href={session.zoomLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm w-full text-center block hover:bg-blue-600"
                      >
                        Join Zoom
                      </a>
                    )}
                    <button
                      onClick={() => deleteSession(session.id)}
                      className="bg-gray-600 hover:bg-gray-500 text-white px-3 py-1 rounded text-sm w-full"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
// New Team Messaging Section - Local only
const TeamMessaging = () => {
  const [message, setMessage] = useState("");
  const [teamMessages, setTeamMessages] = useState([]);
  const addNotification = useManageStore((state) => state.addNotification);
  const handleSendTeamMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const timestamp = new Date().toISOString();
      const messageId = Date.now().toString();
      setTeamMessages((prev) => [
        ...prev,
        { id: messageId, message, timestamp },
      ]);
      // Notify all students
      const state = useManageStore.getState();
      const students = state.directory.filter((u) => u.role === "Student");
      const newNotifs = students.map((student, index) => ({
        id: Date.now() + index,
        userId: student.id,
        type: "team_message",
        messageId,
        message,
        read: false,
        timestamp,
      }));
      newNotifs.forEach((notif) => addNotification(notif));
      setMessage("");
    }
  };
  return (
    <div className="mt-8">
      <h2 className="text-white text-2xl font-bold mb-6">Team Messaging</h2>
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <form onSubmit={handleSendTeamMessage} className="mb-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Send message to entire team..."
              className="flex-1 bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2"
            />
            <button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg"
            >
              Send
            </button>
          </div>
        </form>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {teamMessages
            .sort((a, b) =>
              new Date(a.timestamp) > new Date(b.timestamp) ? -1 : 1
            )
            .map((msg) => (
              <div key={msg.id} className="text-sm text-gray-300">
                {msg.message} - {new Date(msg.timestamp).toLocaleString()}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
// Fixed Private Messaging Section - Now local-only, filters full conversations (sent + received) with selected student
const PrivateMessaging = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [privateMessage, setPrivateMessage] = useState("");
  const [privateMessages, setPrivateMessages] = useState([]);
  const { directory, conversations, addMessage } = useManageStore();
  useEffect(() => {
    // Use directory as students
    const studentList = directory.filter((u) => u.role === "Student");
    setStudents(studentList);
    // Listen to store changes for private messages
    const unsubscribe = useManageStore.subscribe(
      (state) => state.conversations,
      (conv) => {
        const allMsgs = Object.values(conv).flat();
        setPrivateMessages(allMsgs);
      }
    );
    return unsubscribe;
  }, [directory]);
  const handleSendPrivateMessage = (e) => {
    e.preventDefault();
    if (privateMessage.trim() && selectedStudent) {
      const timestamp = new Date().toISOString();
      const messageId = Date.now().toString();
      // Local addMessage
      addMessage(
        2,
        selectedStudent.id,
        2,
        privateMessage,
        timestamp,
        messageId
      );
      setPrivateMessage("");
    } else {
      alert("Please select a student and enter a message.");
    }
  };
  // Fixed filter: Show full conversation (sent to student OR received from student)
  const filteredMessages = selectedStudent
    ? privateMessages.filter(
        (msg) =>
          (msg.senderId === 2 &&
            conversations[
              [
                Math.min(2, selectedStudent.id),
                Math.max(2, selectedStudent.id),
              ].join("-")
            ]?.some((m) => m.id === msg.id)) ||
          (msg.senderId === selectedStudent.id &&
            conversations[
              [
                Math.min(2, selectedStudent.id),
                Math.max(2, selectedStudent.id),
              ].join("-")
            ]?.some((m) => m.id === msg.id))
      )
    : [];
  return (
    <div className="mt-8">
      <h2 className="text-white text-2xl font-bold mb-6">Private Messaging</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-white font-semibold mb-4">Select Student</h3>
          <select
            onChange={(e) => {
              const student = students.find(
                (s) => s.id === parseInt(e.target.value)
              );
              setSelectedStudent(student);
            }}
            className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2"
          >
            <option value="">Choose a student</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.email}
              </option>
            ))}
          </select>
        </div>
        {selectedStudent && (
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-white font-semibold mb-4">
              Message {selectedStudent.email}
            </h3>
            <form onSubmit={handleSendPrivateMessage}>
              <div className="flex space-x-2 mb-4">
                <input
                  type="text"
                  value={privateMessage}
                  onChange={(e) => setPrivateMessage(e.target.value)}
                  placeholder="Send private message..."
                  className="flex-1 bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2"
                />
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  Send
                </button>
              </div>
            </form>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {filteredMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="text-sm text-gray-300 flex justify-between"
                >
                  <span>{msg.text}</span>
                  <span>{new Date(msg.timestamp).toLocaleString()}</span>
                </div>
              ))}
              {filteredMessages.length === 0 && (
                <p className="text-gray-500 text-sm">No messages yet.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
// New Roadmap Management Section Component
const RoadmapManagement = ({
  roadmapItems,
  setCurrentWeek,
  markWeekPassed,
}) => {
  if (roadmapItems.length === 0) {
    return (
      <div className="mt-8">
        <h2 className="text-white text-2xl font-bold mb-6">
          Roadmap Management
        </h2>
        <p className="text-gray-400">No roadmap items found.</p>
      </div>
    );
  }
  return (
    <div className="mt-8">
      <h2 className="text-white text-2xl font-bold mb-6">Roadmap Management</h2>
      <div className="space-y-6">
        {roadmapItems.map((item) => (
          <div
            key={item.id}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-semibold text-lg">
                {item.phase} - {item.term} ({item.status})
              </h3>
            </div>
            {item.weeks && item.weeks.length > 0 ? (
              <div className="space-y-4">
                {item.weeks.map((week, weekIndex) => (
                  <div
                    key={weekIndex}
                    className="flex items-center justify-between p-4 bg-gray-900 rounded border border-gray-700"
                  >
                    <div className="flex-1">
                      <p className="text-white font-medium">
                        Week {week.weekNumber}: {week.topic}
                      </p>
                      <p className="text-gray-400 text-sm">
                        Subtopics: {week.subTopics?.length || 0} | Status:{" "}
                        {week.current
                          ? "Current"
                          : week.next
                          ? "Next"
                          : week.passed
                          ? "Completed"
                          : "Future"}
                      </p>
                    </div>
                    <div className="space-x-2 flex-shrink-0">
                      {week.current ? (
                        <button
                          onClick={() => setCurrentWeek(item.id, null)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm font-semibold"
                        >
                          Unset Current
                        </button>
                      ) : (
                        <button
                          onClick={() => setCurrentWeek(item.id, weekIndex)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded text-sm font-semibold"
                        >
                          Set Current
                        </button>
                      )}
                      <button
                        onClick={() => markWeekPassed(item.id, weekIndex)}
                        className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded text-sm"
                      >
                        Mark Completed
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No weeks added yet.</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
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
      addMessage(currentUser.id, otherUser.id, currentUser.id, newMessage);
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
                  alt={otherUserProfile?.name || otherUser.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-5 h-5 text-gray-300" />
              )}
            </div>
            <div>
              <h3 className="text-white font-semibold">
                {otherUserProfile?.name || otherUser.name}
              </h3>
              <p className="text-gray-400 text-sm">
                {otherUserProfile?.role || otherUser.role}
              </p>
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
// Notification Modal Component (updated to match student's for bi-directional)
const NotificationModal = ({
  isOpen,
  onClose,
  userId,
  directory,
  conversations,
  markNotificationAsRead,
  onOpenChat,
  sessions,
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
    } else if (notif.type === "session_booked") {
      alert(`New session booked. Check Sessions Management.`);
    } else if (notif.type === "program_join_requested") {
      alert(`New program join request. Check Programs.`);
    } else if (notif.type === "friend_request_received") {
      alert(`New friend request received. Check Social Connections.`);
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
          if (notif.type === "message") {
            const sender = directory.find((u) => u.id === notif.fromUserId);
            const convKey = [
              Math.min(userId, notif.fromUserId),
              Math.max(userId, notif.fromUserId),
            ].join("-");
            const messages = conversations[convKey] || [];
            const message = messages.find((m) => m.id === notif.messageId);
            const preview = message
              ? `${message.text.slice(0, 50)}${
                  message.text.length > 50 ? "..." : ""
                }`
              : "New message";
            return (
              <div
                key={notif.id}
                className="p-4 hover:bg-gray-700 cursor-pointer"
                onClick={() => handleNotificationClick(notif)}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {sender?.pictureUrl ? (
                      <img
                        src={sender.pictureUrl}
                        alt={sender?.name || "Sender"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-4 h-4 text-gray-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">
                      {sender?.name || "Unknown"}
                    </p>
                    <p className="text-gray-300 text-sm truncate">{preview}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      {new Date(notif.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            );
          } else if (notif.type === "session_booked") {
            const session = sessions.find((s) => s.id === notif.sessionId);
            return (
              <div
                key={notif.id}
                className="p-4 hover:bg-gray-700 cursor-pointer"
                onClick={() => handleNotificationClick(notif)}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">
                      New Session Booked
                    </p>
                    <p className="text-gray-300 text-sm truncate">
                      {notif.message}
                    </p>
                    {session && (
                      <p className="text-gray-500 text-xs mt-1">
                        {session.title} on{" "}
                        {new Date(notif.timestamp).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          } else if (notif.type === "program_join_requested") {
            const program = programs.find((p) => p.id === notif.programId);
            return (
              <div
                key={notif.id}
                className="p-4 hover:bg-gray-700 cursor-pointer"
                onClick={() => handleNotificationClick(notif)}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">
                      Program Join Request
                    </p>
                    <p className="text-gray-300 text-sm truncate">
                      {notif.message}
                    </p>
                    {program && (
                      <p className="text-gray-500 text-xs mt-1">
                        {program.name}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          } else if (notif.type === "friend_request_received") {
            const sender = directory.find((u) => u.id === notif.fromUserId);
            return (
              <div
                key={notif.id}
                className="p-4 hover:bg-gray-700 cursor-pointer"
                onClick={() => handleNotificationClick(notif)}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">
                      Friend Request
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
          } else {
            // Handle other notifications
            return (
              <div
                key={notif.id}
                className="p-4 hover:bg-gray-700 cursor-pointer"
                onClick={() => handleNotificationClick(notif)}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bell className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">Update</p>
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
          }
        })}
      </div>
    </div>
  );
};
const Administrator = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedForm, setSelectedForm] = useState("");
  const [formData, setFormData] = useState({});
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [studentCount, setStudentCount] = useState(0);
  const [adminProfile, setAdminProfile] = useState(null);
  const markAsRead = useManageStore((state) => state.markAsRead);
  const { directory, conversations } = useManageStore();
  const userId = 2;
  const markNotificationAsRead = useManageStore(
    (state) => state.markNotificationAsRead
  );
  const updateUser = useManageStore((state) => state.updateUser);
  // Removed Firebase UID fetch, use static count from directory
  useEffect(() => {
    const count = directory.filter((u) => u.role === "Student").length;
    setStudentCount(count);
  }, [directory]);
  useEffect(() => {
    const admin = directory.find((u) => u.id === 2);
    setAdminProfile(admin);
  }, [directory]);
  const handleBellClick = () => {
    setIsNotificationOpen(true);
  };
  const handleOpenChatFromNotification = (sender) => {
    setSelectedUser(sender);
    setIsChatOpen(true);
  };
  // Store selectors
  const announcements = useManageStore((state) => state.announcements);
  const events = useManageStore((state) => state.events);
  const assignments = useManageStore((state) => state.assignments);
  const exercises = useManageStore((state) => state.exercises);
  const projects = useManageStore((state) => state.projects);
  const attendance = useManageStore((state) => state.attendance);
  const roadmapItems = useManageStore((state) => state.roadmapItems);
  const classMaterials = useManageStore((state) => state.classMaterials);
  const programs = useManageStore((state) => state.programs);
  const sessions = useManageStore((state) => state.sessions);
  const friendRequests = useManageStore((state) => state.friendRequests);
  const pendingRequests = useMemo(
    () => friendRequests.filter((r) => r.toId === 2 && r.status === "pending"),
    [friendRequests]
  );
  const friendsForAdmin = useMemo(
    () =>
      friendRequests
        .filter(
          (r) => (r.fromId === 2 || r.toId === 2) && r.status === "accepted"
        )
        .map((r) => (r.fromId === 2 ? r.toId : r.fromId)),
    [friendRequests]
  );
  const conversationsAdmin = useManageStore((state) => state.conversations);
  const acceptFriendRequest = useManageStore(
    (state) => state.acceptFriendRequest
  );
  const rejectFriendRequest = useManageStore(
    (state) => state.rejectFriendRequest
  );
  const addMessage = useManageStore((state) => state.addMessage);
  // Store actions
  const addAnnouncement = useManageStore((state) => state.addAnnouncement);
  const updateAnnouncement = useManageStore(
    (state) => state.updateAnnouncement
  );
  const deleteAnnouncement = useManageStore(
    (state) => state.deleteAnnouncement
  );
  const addEvent = useManageStore((state) => state.addEvent);
  const updateEvent = useManageStore((state) => state.updateEvent);
  const deleteEvent = useManageStore((state) => state.deleteEvent);
  const addAssignment = useManageStore((state) => state.addAssignment);
  const updateAssignment = useManageStore((state) => state.updateAssignment);
  const deleteAssignment = useManageStore((state) => state.deleteAssignment);
  const addExercise = useManageStore((state) => state.addExercise);
  const updateExercise = useManageStore((state) => state.updateExercise);
  const deleteExercise = useManageStore((state) => state.deleteExercise);
  const addProject = useManageStore((state) => state.addProject);
  const updateProject = useManageStore((state) => state.updateProject);
  const deleteProject = useManageStore((state) => state.deleteProject);
  const addAttendance = useManageStore((state) => state.addAttendance);
  const updateAttendance = useManageStore((state) => state.updateAttendance);
  const deleteAttendance = useManageStore((state) => state.deleteAttendance);
  const addRoadmapItem = useManageStore((state) => state.addRoadmapItem);
  const updateRoadmapItem = useManageStore((state) => state.updateRoadmapItem);
  const deleteRoadmapItem = useManageStore((state) => state.deleteRoadmapItem);
  const addWeekToRoadmap = useManageStore((state) => state.addWeekToRoadmap);
  const addSubTopicToWeek = useManageStore((state) => state.addSubTopicToWeek);
  const toggleSubTopicComplete = useManageStore(
    (state) => state.toggleSubTopicComplete
  );
  const deleteSubTopic = useManageStore((state) => state.deleteSubTopic);
  const setCurrentWeek = useManageStore((state) => state.setCurrentWeek);
  const markWeekPassed = useManageStore((state) => state.markWeekPassed);
  const addClassMaterial = useManageStore((state) => state.addClassMaterial);
  const updateClassMaterial = useManageStore(
    (state) => state.updateClassMaterial
  );
  const deleteClassMaterial = useManageStore(
    (state) => state.deleteClassMaterial
  );
  const addProgram = useManageStore((state) => state.addProgram);
  const updateProgram = useManageStore((state) => state.updateProgram);
  const deleteProgram = useManageStore((state) => state.deleteProgram);
  const addMilestoneToProgram = useManageStore(
    (state) => state.addMilestoneToProgram
  );
  const adminToggleMilestoneComplete = useManageStore(
    (state) => state.adminToggleMilestoneComplete
  );
  const approveJoinRequest = useManageStore(
    (state) => state.approveJoinRequest
  );
  const rejectJoinRequest = useManageStore((state) => state.rejectJoinRequest);
  const approveSession = useManageStore((state) => state.approveSession);
  const rejectSession = useManageStore((state) => state.rejectSession);
  const startSession = useManageStore((state) => state.startSession);
  const updateSession = useManageStore((state) => state.updateSession);
  const deleteSession = useManageStore((state) => state.deleteSession);
  const adminUser = { id: 2, name: "Admin" };
  // Debug log - Reduced dependencies to prevent potential loops
  useEffect(() => {
    console.log("Administrator - State Update");
    console.log("Announcements:", announcements.length);
    console.log("Assignments:", assignments.length);
    console.log("Exercises:", exercises.length);
    console.log("Projects:", projects.length);
    console.log("Attendance:", attendance.length);
    console.log("Roadmap Items:", roadmapItems.length);
    console.log("Class Materials:", classMaterials.length);
    console.log("Programs:", programs.length);
  }, [
    announcements.length,
    assignments.length,
    exercises.length,
    projects.length,
    attendance.length,
    roadmapItems.length,
    classMaterials.length,
    programs.length,
  ]);
  const students = useMemo(
    () => directory.filter((u) => u.role === "Student"),
    [directory]
  );
  const recentStudents = useMemo(
    () =>
      students.slice(0, 5).map((student) => ({
        id: student.id,
        name: student.name,
        email: student.email,
        cohort: student.cohort,
        status: "active",
        attendance: student.attendance || 0,
      })),
    [students]
  );
  const stats = [
    {
      label: "Total Students",
      value: studentCount.toString(),
      icon: Users,
      color: "yellow",
    },
    { label: "Active Courses", value: "8", icon: BookOpen, color: "blue" },
  ];
  const pendingActions = useMemo(
    () => [
      ...assignments
        .filter((assignment) => assignment.status === "submitted")
        .map((assignment) => ({
          id: `assignment-${assignment.id}`,
          type: "Assignment Review",
          student:
            recentStudents.find((s) => s.id === assignment.studentId)?.name ||
            "Unknown",
          description: assignment.title,
          priority: "medium",
        })),
      ...exercises
        .filter((exercise) => exercise.status === "submitted")
        .map((exercise) => ({
          id: `exercise-${exercise.id}`,
          type: "Exercise Review",
          student:
            recentStudents.find((s) => s.id === exercise.studentId)?.name ||
            "Unknown",
          description: exercise.title,
          priority: "medium",
        })),
      ...projects
        .filter((project) => project.status === "submitted")
        .map((project) => ({
          id: `project-${project.id}`,
          type: "Project Review",
          student:
            recentStudents.find((s) => s.id === project.studentId)?.name ||
            "Unknown",
          description: project.title,
          priority: "medium",
        })),
    ],
    [assignments, exercises, projects, recentStudents]
  );
  const StatIcon = ({ icon: IconComponent, color }) => (
    <IconComponent
      className={`w-8 h-8 ${
        color === "yellow"
          ? "text-yellow-500"
          : color === "blue"
          ? "text-blue-500"
          : color === "green"
          ? "text-green-500"
          : "text-purple-500"
      }`}
    />
  );
  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newId = (arr) =>
      arr.length ? Math.max(...arr.map((item) => item.id)) + 1 : 1;
    switch (selectedForm) {
      case "announcement": {
        if (!formData.title || !formData.content) {
          alert("Please fill in all required fields (Title and Content).");
          return;
        }
        const now = new Date();
        const newAnnouncement = {
          id: newId(announcements),
          title: formData.title,
          content: formData.content,
          date: now.toISOString().split("T")[0],
          time: now.toTimeString().split(" ")[0].slice(0, 5),
          priority: formData.priority || "medium",
          author: formData.author || "Admin Team",
        };
        addAnnouncement(newAnnouncement);
        alert("Announcement added successfully!");
        break;
      }
      case "announcement-edit": {
        if (!formData.title || !formData.content) {
          alert("Please fill in all required fields (Title and Content).");
          return;
        }
        const announcement = announcements.find((a) => a.id === formData.id);
        updateAnnouncement(formData.id, {
          title: formData.title,
          content: formData.content,
          priority: formData.priority || "medium",
          author: formData.author || "Admin Team",
          date: announcement.date,
          time: announcement.time,
        });
        alert("Announcement updated successfully!");
        break;
      }
      case "event": {
        if (!formData.event || !formData.date || !formData.time) {
          alert("Please fill in all required fields (Event, Date, and Time).");
          return;
        }
        if (formData.id) {
          updateEvent(formData.id, {
            event: formData.event,
            date: formData.date,
            time: formData.time,
          });
          alert("Event updated successfully!");
        } else {
          addEvent({
            id: newId(events),
            event: formData.event,
            date: formData.date,
            time: formData.time,
          });
          alert("Event added successfully!");
        }
        break;
      }
      case "assignment": {
        if (
          !formData.title ||
          !formData.dueDate ||
          !formData.points ||
          !formData.studentId
        ) {
          alert("Please fill in all required fields.");
          return;
        }
        const points = parseInt(formData.points);
        if (isNaN(points) || points <= 0) {
          alert("Please enter a valid number of points.");
          return;
        }
        const now = new Date();
        const newAssignment = {
          id: newId(assignments),
          title: formData.title,
          description: formData.description || "",
          dueDate: formData.dueDate,
          points,
          studentId: parseInt(formData.studentId),
          status: "pending",
          createdDate: now.toISOString().split("T")[0],
          createdTime: now.toTimeString().split(" ")[0].slice(0, 5),
        };
        addAssignment(newAssignment);
        alert("Assignment added successfully! Student will see it now.");
        break;
      }
      case "assignment-edit": {
        if (
          !formData.title ||
          !formData.dueDate ||
          !formData.points ||
          !formData.studentId
        ) {
          alert("Please fill in all required fields.");
          return;
        }
        const points = parseInt(formData.points);
        if (isNaN(points) || points <= 0) {
          alert("Please enter a valid number of points.");
          return;
        }
        updateAssignment(formData.id, {
          title: formData.title,
          description: formData.description || "",
          dueDate: formData.dueDate,
          points,
          studentId: parseInt(formData.studentId),
        });
        alert("Assignment updated successfully!");
        break;
      }
      case "exercise": {
        if (
          !formData.title ||
          !formData.dueDate ||
          !formData.points ||
          !formData.studentId
        ) {
          alert("Please fill in all required fields.");
          return;
        }
        const points = parseInt(formData.points);
        if (isNaN(points) || points <= 0) {
          alert("Please enter a valid number of points.");
          return;
        }
        const now = new Date();
        const newExercise = {
          id: newId(exercises),
          title: formData.title,
          description: formData.description || "",
          dueDate: formData.dueDate,
          points,
          studentId: parseInt(formData.studentId),
          status: "pending",
          createdDate: now.toISOString().split("T")[0],
          createdTime: now.toTimeString().split(" ")[0].slice(0, 5),
        };
        addExercise(newExercise);
        alert("Exercise added successfully! Student will see it now.");
        break;
      }
      case "exercise-edit": {
        if (
          !formData.title ||
          !formData.dueDate ||
          !formData.points ||
          !formData.studentId
        ) {
          alert("Please fill in all required fields.");
          return;
        }
        const points = parseInt(formData.points);
        if (isNaN(points) || points <= 0) {
          alert("Please enter a valid number of points.");
          return;
        }
        updateExercise(formData.id, {
          title: formData.title,
          description: formData.description || "",
          dueDate: formData.dueDate,
          points,
          studentId: parseInt(formData.studentId),
        });
        alert("Exercise updated successfully!");
        break;
      }
      case "project": {
        if (
          !formData.title ||
          !formData.dueDate ||
          !formData.points ||
          !formData.studentId
        ) {
          alert("Please fill in all required fields.");
          return;
        }
        const points = parseInt(formData.points);
        if (isNaN(points) || points <= 0) {
          alert("Please enter a valid number of points.");
          return;
        }
        const now = new Date();
        const newProject = {
          id: newId(projects),
          title: formData.title,
          description: formData.description || "",
          dueDate: formData.dueDate,
          points,
          studentId: parseInt(formData.studentId),
          status: "pending",
          createdDate: now.toISOString().split("T")[0],
          createdTime: now.toTimeString().split(" ")[0].slice(0, 5),
        };
        addProject(newProject);
        alert("Project added successfully! Student will see it now.");
        break;
      }
      case "project-edit": {
        if (
          !formData.title ||
          !formData.dueDate ||
          !formData.points ||
          !formData.studentId
        ) {
          alert("Please fill in all required fields.");
          return;
        }
        const points = parseInt(formData.points);
        if (isNaN(points) || points <= 0) {
          alert("Please enter a valid number of points.");
          return;
        }
        updateProject(formData.id, {
          title: formData.title,
          description: formData.description || "",
          dueDate: formData.dueDate,
          points,
          studentId: parseInt(formData.studentId),
        });
        alert("Project updated successfully!");
        break;
      }
      case "attendance": {
        if (
          !formData.date ||
          !formData.status ||
          !formData.topic ||
          !formData.studentId
        ) {
          alert("Please fill in all required fields.");
          return;
        }
        const newAttendance = {
          id: newId(attendance),
          date: formData.date,
          status: formData.status,
          topic: formData.topic,
          studentId: parseInt(formData.studentId),
        };
        addAttendance(newAttendance);
        alert("Attendance record added successfully! Student will see it now.");
        break;
      }
      case "attendance-edit": {
        if (
          !formData.date ||
          !formData.status ||
          !formData.topic ||
          !formData.studentId
        ) {
          alert("Please fill in all required fields.");
          return;
        }
        updateAttendance(formData.id, {
          date: formData.date,
          status: formData.status,
          topic: formData.topic,
          studentId: parseInt(formData.studentId),
        });
        alert("Attendance record updated successfully!");
        break;
      }
      case "roadmap": {
        if (!formData.phase || !formData.term || !formData.status) {
          alert("Please fill in all required fields (Phase, Term, Status).");
          return;
        }
        const newRoadmapItem = {
          id: newId(roadmapItems),
          phase: formData.phase,
          term: formData.term,
          status: formData.status,
          weeks: [],
        };
        addRoadmapItem(newRoadmapItem);
        alert("Roadmap item added successfully!");
        break;
      }
      case "roadmap-edit": {
        if (!formData.phase || !formData.term || !formData.status) {
          alert("Please fill in all required fields (Phase, Term, Status).");
          return;
        }
        updateRoadmapItem(formData.id, {
          phase: formData.phase,
          term: formData.term,
          status: formData.status,
        });
        alert("Roadmap item updated successfully!");
        break;
      }
      case "week": {
        if (!formData.roadmapId || !formData.weekNumber || !formData.topic) {
          alert(
            "Please fill in all required fields (Roadmap ID, Week Number, Topic)."
          );
          return;
        }
        const weekNumber = parseInt(formData.weekNumber);
        if (isNaN(weekNumber) || weekNumber <= 0) {
          alert("Please enter a valid week number.");
          return;
        }
        addWeekToRoadmap(
          parseInt(formData.roadmapId),
          weekNumber,
          formData.topic
        );
        alert("Week added successfully!");
        break;
      }
      case "subtopic": {
        if (
          !formData.roadmapId ||
          !formData.weekIndex ||
          !formData.subTopicName
        ) {
          alert(
            "Please fill in all required fields (Roadmap ID, Week Index, Subtopic Name)."
          );
          return;
        }
        const weekIndex = parseInt(formData.weekIndex);
        if (isNaN(weekIndex) || weekIndex < 0) {
          alert("Please enter a valid week index.");
          return;
        }
        addSubTopicToWeek(
          parseInt(formData.roadmapId),
          weekIndex,
          formData.subTopicName
        );
        alert("Subtopic added successfully!");
        break;
      }
      case "classmaterial":
      case "classmaterial-edit": {
        if (
          !formData.title ||
          !formData.week ||
          !formData.resources ||
          !formData.topics
        ) {
          alert("Please fill in all required fields.");
          return;
        }
        const weekNum = parseInt(formData.week);
        const resourcesNum = parseInt(formData.resources);
        if (
          isNaN(weekNum) ||
          weekNum <= 0 ||
          isNaN(resourcesNum) ||
          resourcesNum <= 0
        ) {
          alert("Please enter valid numbers for week and resources.");
          return;
        }
        const topics = formData.topics
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t);
        if (topics.length === 0) {
          alert("Please enter at least one topic.");
          return;
        }
        const materialData = {
          title: formData.title,
          week: weekNum,
          resources: resourcesNum,
          topics,
          files: [], // Placeholder for files; can be extended later
        };
        if (selectedForm === "classmaterial") {
          const newMaterial = {
            id: newId(classMaterials),
            ...materialData,
          };
          addClassMaterial(newMaterial);
          alert("Class material added successfully! Student will see it now.");
        } else {
          updateClassMaterial(formData.id, materialData);
          alert("Class material updated successfully!");
        }
        break;
      }
      case "program":
      case "program-edit": {
        if (
          !formData.name ||
          !formData.description ||
          !formData.totalMilestones
        ) {
          alert(
            "Please fill in all required fields (Name, Description, Total Milestones)."
          );
          return;
        }
        const totalMilestones = parseInt(formData.totalMilestones);
        if (isNaN(totalMilestones) || totalMilestones <= 0) {
          alert("Please enter a valid number number for total milestones.");
          return;
        }
        if (selectedForm === "program") {
          const newProgram = {
            id: newId(programs),
            name: formData.name,
            description: formData.description,
            totalMilestones,
            milestones: [],
            pendingRequests: [],
            enrolledStudents: [],
          };
          addProgram(newProgram);
          alert("Program added successfully!");
        } else {
          updateProgram(formData.id, {
            name: formData.name,
            description: formData.description,
            totalMilestones,
          });
          alert("Program updated successfully!");
        }
        break;
      }
      case "milestone": {
        if (!formData.programId || !formData.milestoneName) {
          alert(
            "Please fill in all required fields (Program ID and Milestone Name)."
          );
          return;
        }
        const programId = parseInt(formData.programId);
        const program = programs.find((p) => p.id === programId);
        if (!program) {
          alert("Program not found.");
          return;
        }
        if (program.milestones.length >= program.totalMilestones) {
          alert("Maximum milestones reached for this program.");
          return;
        }
        addMilestoneToProgram(programId, formData.milestoneName);
        alert("Milestone added successfully!");
        break;
      }
      default:
        break;
    }
    setFormData({});
    setSelectedForm("");
  };
  const uploadToCloudinary = async (file) => {
    const cloudName = "dpttonwcs";
    const uploadPreset = "Julius";
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    try {
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (data.secure_url) {
        return data.secure_url;
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      return null;
    }
  };
  const handleAdminImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }
    const imageUrl = await uploadToCloudinary(file);
    if (imageUrl) {
      updateUser(2, { pictureUrl: imageUrl });
      alert("Profile picture updated successfully!");
    } else {
      alert("Failed to upload image. Please try again.");
    }
    e.target.value = "";
  };
  const handleEditEvent = (event) => {
    setFormData({
      id: event.id,
      event: event.event,
      date: event.date,
      time: event.time,
    });
    setSelectedForm("event");
  };
  const handleEditAnnouncement = (announcement) => {
    setFormData({
      id: announcement.id,
      title: announcement.title,
      content: announcement.content,
      priority: announcement.priority,
      author: announcement.author,
    });
    setSelectedForm("announcement-edit");
  };
  const getFormTitle = (formType, hasId) => {
    const titles = {
      announcement: "New Announcement",
      "announcement-edit": "Edit Announcement",
      assignment: "New Assignment",
      "assignment-edit": "Edit Assignment",
      exercise: "New Exercise",
      "exercise-edit": "Edit Exercise",
      project: "New Project",
      "project-edit": "Edit Project",
      event: hasId ? "Edit Event" : "New Event",
      attendance: "New Attendance",
      "attendance-edit": "Edit Attendance",
      roadmap: "New Roadmap Item",
      "roadmap-edit": "Edit Roadmap Item",
      week: "New Week",
      subtopic: "New Subtopic",
      classmaterial: "New Class Material",
      "classmaterial-edit": "Edit Class Material",
      program: "New Program",
      "program-edit": "Edit Program",
      milestone: "New Milestone",
    };
    return titles[formType] || "Edit Item";
  };
  const renderForm = () => {
    switch (selectedForm) {
      case "announcement":
      case "announcement-edit":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title || ""}
                onChange={(e) => handleFormChange("title", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Content *
              </label>
              <textarea
                value={formData.content || ""}
                onChange={(e) => handleFormChange("content", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                rows="4"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Priority
              </label>
              <select
                value={formData.priority || "medium"}
                onChange={(e) => handleFormChange("priority", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Author</label>
              <input
                type="text"
                value={formData.author || "Admin Team"}
                onChange={(e) => handleFormChange("author", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
              />
            </div>
          </div>
        );
      case "assignment":
      case "assignment-edit":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title || ""}
                onChange={(e) => handleFormChange("title", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Description
              </label>
              <textarea
                value={formData.description || ""}
                onChange={(e) =>
                  handleFormChange("description", e.target.value)
                }
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                rows="4"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Due Date *
              </label>
              <input
                type="date"
                value={formData.dueDate || ""}
                onChange={(e) => handleFormChange("dueDate", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Points *
              </label>
              <input
                type="number"
                value={formData.points || ""}
                onChange={(e) => handleFormChange("points", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Student ID * (Select from dropdown)
              </label>
              <select
                value={formData.studentId || ""}
                onChange={(e) => handleFormChange("studentId", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              >
                <option value="">Select Student</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name} (ID: {student.id})
                  </option>
                ))}
              </select>
            </div>
          </div>
        );
      case "exercise":
      case "exercise-edit":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title || ""}
                onChange={(e) => handleFormChange("title", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Description
              </label>
              <textarea
                value={formData.description || ""}
                onChange={(e) =>
                  handleFormChange("description", e.target.value)
                }
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                rows="4"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Due Date *
              </label>
              <input
                type="date"
                value={formData.dueDate || ""}
                onChange={(e) => handleFormChange("dueDate", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Points *
              </label>
              <input
                type="number"
                value={formData.points || ""}
                onChange={(e) => handleFormChange("points", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Student ID * (Select from dropdown)
              </label>
              <select
                value={formData.studentId || ""}
                onChange={(e) => handleFormChange("studentId", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              >
                <option value="">Select Student</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name} (ID: {student.id})
                  </option>
                ))}
              </select>
            </div>
          </div>
        );
      case "project":
      case "project-edit":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title || ""}
                onChange={(e) => handleFormChange("title", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Description
              </label>
              <textarea
                value={formData.description || ""}
                onChange={(e) =>
                  handleFormChange("description", e.target.value)
                }
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                rows="4"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Due Date *
              </label>
              <input
                type="date"
                value={formData.dueDate || ""}
                onChange={(e) => handleFormChange("dueDate", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Points *
              </label>
              <input
                type="number"
                value={formData.points || ""}
                onChange={(e) => handleFormChange("points", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Student ID * (Select from dropdown)
              </label>
              <select
                value={formData.studentId || ""}
                onChange={(e) => handleFormChange("studentId", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              >
                <option value="">Select Student</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name} (ID: {student.id})
                  </option>
                ))}
              </select>
            </div>
          </div>
        );
      case "event":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Event *
              </label>
              <input
                type="text"
                value={formData.event || ""}
                onChange={(e) => handleFormChange("event", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Date *</label>
              <input
                type="date"
                value={formData.date || ""}
                onChange={(e) => handleFormChange("date", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Time *</label>
              <input
                type="time"
                value={formData.time || ""}
                onChange={(e) => handleFormChange("time", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
            </div>
          </div>
        );
      case "attendance":
      case "attendance-edit":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Date *</label>
              <input
                type="date"
                value={formData.date || ""}
                onChange={(e) => handleFormChange("date", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Topic *
              </label>
              <input
                type="text"
                value={formData.topic || ""}
                onChange={(e) => handleFormChange("topic", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Status *
              </label>
              <select
                value={formData.status || ""}
                onChange={(e) => handleFormChange("status", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              >
                <option value="">Select Status</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Student ID * (Select from dropdown)
              </label>
              <select
                value={formData.studentId || ""}
                onChange={(e) => handleFormChange("studentId", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              >
                <option value="">Select Student</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name} (ID: {student.id})
                  </option>
                ))}
              </select>
            </div>
          </div>
        );
      case "roadmap":
      case "roadmap-edit":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Phase *
              </label>
              <input
                type="text"
                placeholder="e.g., First_Term"
                value={formData.phase || ""}
                onChange={(e) => handleFormChange("phase", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Term (no. of weeks) *
              </label>
              <input
                type="text"
                placeholder="e.g., 13-weeks"
                value={formData.term || ""}
                onChange={(e) => handleFormChange("term", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Status *
              </label>
              <select
                value={formData.status || ""}
                onChange={(e) => handleFormChange("status", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              >
                <option value="">Select Status</option>
                <option value="not-started">Not Started</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        );
      case "week":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Roadmap ID *
              </label>
              <input
                type="number"
                value={formData.roadmapId || ""}
                onChange={(e) => handleFormChange("roadmapId", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
              <p className="text-gray-500 text-xs mt-1">
                Enter the ID of the roadmap to add the week to.
              </p>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Week Number *
              </label>
              <input
                type="number"
                value={formData.weekNumber || ""}
                onChange={(e) => handleFormChange("weekNumber", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Topic *
              </label>
              <input
                type="text"
                value={formData.topic || ""}
                onChange={(e) => handleFormChange("topic", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
            </div>
          </div>
        );
      case "subtopic":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Roadmap ID *
              </label>
              <input
                type="number"
                value={formData.roadmapId || ""}
                onChange={(e) => handleFormChange("roadmapId", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
              <p className="text-gray-500 text-xs mt-1">
                Enter the ID of the roadmap containing the week.
              </p>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Week Index *
              </label>
              <input
                type="number"
                value={formData.weekIndex || ""}
                onChange={(e) => handleFormChange("weekIndex", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
              <p className="text-gray-500 text-xs mt-1">
                Enter the index of the week (0-based) to add the subtopic to.
              </p>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Subtopic Name *
              </label>
              <input
                type="text"
                value={formData.subTopicName || ""}
                onChange={(e) =>
                  handleFormChange("subTopicName", e.target.value)
                }
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
            </div>
          </div>
        );
      case "classmaterial":
      case "classmaterial-edit":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title || ""}
                onChange={(e) => handleFormChange("title", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Week *</label>
              <input
                type="number"
                value={formData.week || ""}
                onChange={(e) => handleFormChange("week", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Number of Resources *
              </label>
              <input
                type="number"
                value={formData.resources || ""}
                onChange={(e) => handleFormChange("resources", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Topics (comma separated) *
              </label>
              <textarea
                value={formData.topics || ""}
                onChange={(e) => handleFormChange("topics", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                rows="3"
                placeholder="e.g., JavaScript Basics, React Components"
                required
              />
            </div>
          </div>
        );
      case "program":
      case "program-edit":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Name *</label>
              <input
                type="text"
                value={formData.name || ""}
                onChange={(e) => handleFormChange("name", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Description *
              </label>
              <textarea
                value={formData.description || ""}
                onChange={(e) =>
                  handleFormChange("description", e.target.value)
                }
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                rows="4"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Total Milestones *
              </label>
              <input
                type="number"
                value={formData.totalMilestones || ""}
                onChange={(e) =>
                  handleFormChange("totalMilestones", e.target.value)
                }
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
                placeholder="e.g., 5"
              />
              <p className="text-gray-500 text-xs mt-1">
                Enter the total number of milestones for this program.
              </p>
            </div>
          </div>
        );
      case "milestone":
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Program ID *
              </label>
              <input
                type="number"
                value={formData.programId || ""}
                onChange={(e) => handleFormChange("programId", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
              <p className="text-gray-500 text-xs mt-1">
                Enter the ID of the program to add the milestone to.
              </p>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Milestone Name *
              </label>
              <input
                type="text"
                value={formData.milestoneName || ""}
                onChange={(e) =>
                  handleFormChange("milestoneName", e.target.value)
                }
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  // 100 Days To BECE logic
  const daysOfLearning = useManageStore((state) => state.daysOfLearning);
  const updateDaysOfLearning = useManageStore(
    (state) => state.updateDaysOfLearning
  );
  const todayStr = new Date().toISOString().split("T")[0];
  const isTodayCompleted = daysOfLearning.lastCompletedDate === todayStr;
  const isChallengeCompleted =
    daysOfLearning.completedDays >= daysOfLearning.totalDays;
  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-white text-xl font-semibold">
            Administrator Panel - Team Size: {studentCount}
          </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBellClick}
              className="relative text-gray-400 hover:text-white"
            >
              <Bell className="w-6 h-6" />
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center transform translate-x-1/2 -translate-y-1/2">
                {
                  useManageStore
                    .getState()
                    .notifications.filter((n) => n.userId === userId && !n.read)
                    .length
                }
              </span>
            </button>
            <div className="relative group">
              {adminProfile?.pictureUrl ? (
                <img
                  src={adminProfile.pictureUrl}
                  alt="Admin Profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-400" />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleAdminImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-full"
              />
              <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <span className="text-white text-xs">Upload Photo</span>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="space-y-6 p-6">
        <Admini
          stats={stats}
          StatIcon={StatIcon}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedForm={selectedForm}
          setSelectedForm={setSelectedForm}
          setFormData={setFormData}
          formData={formData}
          handleFormChange={handleFormChange}
          handleFormSubmit={handleFormSubmit}
          renderForm={renderForm}
          getFormTitle={getFormTitle}
          events={events}
          handleEditEvent={handleEditEvent}
          deleteEvent={deleteEvent}
          pendingActions={pendingActions}
          announcements={announcements}
          handleEditAnnouncement={handleEditAnnouncement}
          deleteAnnouncement={deleteAnnouncement}
        />
        <Administra
          activeTab={activeTab}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setSelectedForm={setSelectedForm}
          setFormData={setFormData}
          formData={formData}
          recentStudents={recentStudents}
          assignments={assignments}
          exercises={exercises}
          projects={projects}
        />
        <Adminis
          activeTab={activeTab}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setSelectedForm={setSelectedForm}
          setFormData={setFormData}
          formData={formData}
          recentStudents={recentStudents}
          attendance={attendance}
          roadmapItems={roadmapItems}
          classMaterials={classMaterials}
          programs={programs}
        />
        <SessionsManagement
          directory={directory}
          approveSession={approveSession}
          rejectSession={rejectSession}
          startSession={startSession}
          deleteSession={deleteSession}
        />
        <RoadmapManagement
          roadmapItems={roadmapItems}
          setCurrentWeek={setCurrentWeek}
          markWeekPassed={markWeekPassed}
        />
        {/* 100 Days To BECE Management */}
        <div className="mt-8">
          <h2 className="text-white text-2xl font-bold mb-6">
            100 Days To BECE
          </h2>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white text-lg font-semibold">
                  Auto-Progress for Daily Readings
                </h3>
                <p className="text-gray-400">
                  Enable automatic daily completion and ticking of boxes
                </p>
              </div>
              <button
                onClick={() =>
                  updateDaysOfLearning({ isActive: !daysOfLearning.isActive })
                }
                className={`px-4 py-2 rounded-lg font-semibold ${
                  daysOfLearning.isActive
                    ? "bg-green-500 text-white"
                    : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                }`}
              >
                {daysOfLearning.isActive ? "Active" : "Inactive"}
              </button>
            </div>
            <div className="space-y-2 text-gray-400">
              <p>
                Completed Days: {daysOfLearning.completedDays} of{" "}
                {daysOfLearning.totalDays}
              </p>
              <p>
                Last Completed:{" "}
                {daysOfLearning.lastCompletedDate || "Not started"}
              </p>
              <p>Today's Status: {isTodayCompleted ? "Ticked" : "Pending"}</p>
            </div>
            <button
              onClick={() => {
                if (isTodayCompleted) {
                  alert("Already ticked for today!");
                  return;
                }
                if (isChallengeCompleted) {
                  alert("Challenge completed!");
                  return;
                }
                updateDaysOfLearning({
                  completedDays: daysOfLearning.completedDays + 1,
                  lastCompletedDate: todayStr,
                  activities: [
                    ...daysOfLearning.activities,
                    {
                      day: daysOfLearning.completedDays + 1,
                      content: "Manually ticked by admin",
                      timestamp: new Date().toISOString(),
                    },
                  ],
                });
                alert("Day ticked successfully!");
              }}
              disabled={isTodayCompleted || isChallengeCompleted}
              className={`mt-4 px-4 py-2 rounded-lg font-semibold ${
                isTodayCompleted || isChallengeCompleted
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-yellow-500 hover:bg-yellow-600 text-gray-900"
              }`}
            >
              {isChallengeCompleted
                ? "Challenge Completed"
                : isTodayCompleted
                ? "Already Ticked Today"
                : "Manually Tick Next Day"}
            </button>
          </div>
        </div>
        {/* Social Connections Management */}
        <div className="mt-8">
          <h2 className="text-white text-2xl font-bold mb-6">
            Social Connections
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-white font-semibold mb-4">
                Pending Friend Requests
              </h3>
              {pendingRequests.length > 0 ? (
                pendingRequests.map((req) => {
                  const fromUser = directory.find((u) => u.id === req.fromId);
                  return (
                    <div
                      key={req.id}
                      className="flex items-center justify-between p-3 bg-gray-700 rounded mb-3"
                    >
                      <div>
                        <p className="text-white">
                          {fromUser?.name || "Unknown"}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {fromUser?.email}
                        </p>
                      </div>
                      <div className="space-x-2">
                        <button
                          onClick={() => acceptFriendRequest(req.id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => rejectFriendRequest(req.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-400">No pending friend requests.</p>
              )}
            </div>
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-white font-semibold mb-4">Friends</h3>
              {friendsForAdmin.length > 0 ? (
                friendsForAdmin.map((friendId) => {
                  const friend = directory.find((u) => u.id === friendId);
                  return (
                    <div
                      key={friendId}
                      className="flex items-center justify-between p-3 bg-gray-700 rounded mb-3"
                    >
                      <div>
                        <p className="text-white">
                          {friend?.name || "Unknown"}
                        </p>
                        <p className="text-gray-400 text-sm">{friend?.role}</p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedUser(friend);
                          setIsChatOpen(true);
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
                      >
                        Chat
                      </button>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-400">No friends yet.</p>
              )}
            </div>
          </div>
        </div>
        {/* Students Directory with Pictures and Signup Details */}
        <div className="mt-8">
          <h2 className="text-white text-2xl font-bold mb-6">
            Students Directory
          </h2>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            {students.length === 0 ? (
              <p className="text-gray-400 text-center">No students found.</p>
            ) : (
              <div className="space-y-4">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-start space-x-4 p-4 bg-gray-900 rounded-lg border border-gray-700"
                  >
                    <img
                      src={
                        student.pictureUrl ||
                        "https://via.placeholder.com/48?text=👤"
                      }
                      alt={student.name}
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0 mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold truncate">
                        {student.name}
                      </h3>
                      <p className="text-gray-400 text-sm">ID: {student.id}</p>
                      <p className="text-gray-300 text-sm truncate">
                        {student.email}
                      </p>
                      {student.cohort && (
                        <p className="text-gray-500 text-xs">
                          Cohort: {student.cohort}
                        </p>
                      )}
                      {student.startDate && (
                        <p className="text-gray-500 text-xs">
                          Joined:{" "}
                          {new Date(student.startDate).toLocaleDateString()}
                        </p>
                      )}
                      {student.bio && (
                        <p className="text-gray-500 text-xs truncate mt-1">
                          Bio: {student.bio}
                        </p>
                      )}
                      {student.location && (
                        <p className="text-gray-500 text-xs">
                          Location: {student.location}
                        </p>
                      )}
                      {student.phone && (
                        <p className="text-gray-500 text-xs">
                          Phone: {student.phone}
                        </p>
                      )}
                      {student.github && (
                        <p className="text-gray-500 text-xs">
                          GitHub:{" "}
                          <a
                            href={`https://github.com/${student.github}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline"
                          >
                            @{student.github}
                          </a>
                        </p>
                      )}
                      {student.linkedin && (
                        <p className="text-gray-500 text-xs">
                          LinkedIn:{" "}
                          <a
                            href={`https://linkedin.com/in/${student.linkedin}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline"
                          >
                            @{student.linkedin}
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {/* New Team and Private Messaging Sections */}
        <TeamMessaging />
        <PrivateMessaging />
        {isChatOpen && selectedUser && (
          <ChatModal
            onClose={() => setIsChatOpen(false)}
            otherUser={selectedUser}
            currentUser={adminUser}
          />
        )}
      </div>
      <NotificationModal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        userId={userId}
        directory={directory}
        conversations={conversationsAdmin}
        markNotificationAsRead={markNotificationAsRead}
        onOpenChat={handleOpenChatFromNotification}
        sessions={sessions}
        programs={programs}
      />
    </div>
  );
};
export default Administrator;
