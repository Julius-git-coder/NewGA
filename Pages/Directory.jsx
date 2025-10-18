// Complete fixed Directory.jsx
import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  User,
  Mail,
  Github,
  MessageSquare,
  UserPlus,
  Users,
  Clock,
  RefreshCw,
  X,
} from "lucide-react";
import useManageStore from "../src/Store/useManageStore";
// Simple Chat Modal Component - Full screen
const ChatModal = ({ onClose, otherUser, currentUser }) => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { conversations, addMessage, directory } = useManageStore();
  const markNotificationAsRead = useManageStore(
    (state) => state.markNotificationAsRead
  );
  const otherUserProfile =
    directory.find((u) => u.id === otherUser.id) || otherUser;
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
const Directory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const {
    directory: storeDirectory,
    friendRequests,
    sendFriendRequest,
    addNotification,
  } = useManageStore();
  const currentUser = { id: 1, name: "Julius Dagana" };
  // FIXED FALLBACK: Trigger if empty array or null/undefined
  const fallbackDirectory = [
    {
      id: 1,
      name: "Julius Dagana",
      email: "julius@example.com",
      role: "Student",
      github: "juliusdagana",
      cohort: "2024-B",
    },
    {
      id: 2,
      name: "Admin",
      email: "admin@gradea.com",
      role: "Administrator",
      github: "admin",
      cohort: "Staff",
    },
    {
      id: 3,
      name: "Instructor Smith",
      email: "smith@example.com",
      role: "Instructor",
      github: "smith",
      specialty: "Web Development",
    },
    {
      id: 4,
      name: "TA John",
      email: "john@example.com",
      role: "Teaching Assistant",
      github: "johnTA",
      cohort: "2024-A",
    },
  ];
  const directory =
    storeDirectory && storeDirectory.length > 0
      ? storeDirectory
      : fallbackDirectory;
  // Memoized derived state
  const friends = useMemo(
    () =>
      friendRequests
        .filter(
          (r) =>
            (r.fromId === currentUser.id || r.toId === currentUser.id) &&
            r.status === "accepted"
        )
        .map((r) => (r.fromId === currentUser.id ? r.toId : r.fromId)),
    [friendRequests, currentUser.id]
  );
  const pendingOutgoing = useMemo(
    () =>
      friendRequests
        .filter((r) => r.fromId === currentUser.id && r.status === "pending")
        .map((r) => r.toId),
    [friendRequests, currentUser.id]
  );
  const isFriend = useMemo(
    () => (personId) => friends.includes(personId),
    [friends]
  );
  const hasPendingOutgoing = useMemo(
    () => (personId) => pendingOutgoing.includes(personId),
    [pendingOutgoing]
  );
  // Synchronous filter (instant results)
  const filteredPeople = useMemo(
    () =>
      directory.filter(
        (person) =>
          person.id !== currentUser.id &&
          (person.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase().trim()) ||
            person.role.toLowerCase().includes(searchTerm.toLowerCase().trim()))
      ),
    [directory, currentUser.id, searchTerm]
  );
  // Debug log on every render
  console.log(
    "Rendering Directory - Store length:",
    storeDirectory?.length || 0,
    "Using fallback?",
    !(storeDirectory && storeDirectory.length > 0),
    "Directory length:",
    directory.length,
    "Search:",
    searchTerm,
    "Filtered length:",
    filteredPeople.length
  );
  // Debug on mount
  useEffect(() => {
    console.log("Directory mounted - Store directory:", storeDirectory);
    if (!(storeDirectory && storeDirectory.length > 0)) {
      console.warn(
        "Using fallback directory (store was empty). Click 'Reset Store' to clear localStorage."
      );
    }
  }, [storeDirectory]);
  // Reset store function (for testing)
  const resetStore = () => {
    localStorage.removeItem("manage-store");
    window.location.reload();
  };
  const handleSendRequest = (personId) => {
    if (!isFriend(personId) && !hasPendingOutgoing(personId)) {
      sendFriendRequest(currentUser.id, personId);
      // FIXED: Add self-notification for sender
      const toUser = directory.find((u) => u.id === personId);
      const newNotifForSender = {
        id: Date.now() + 1,
        userId: currentUser.id,
        type: "friend_request_sent",
        toUserId: personId,
        message: `Friend request sent to ${toUser?.name}`,
        read: false,
        timestamp: new Date().toISOString(),
      };
      addNotification(newNotifForSender);
      alert("Friend request sent!");
    }
  };
  const handleMessage = (person) => {
    if (isFriend(person.id)) {
      setSelectedUser(person);
      setIsChatOpen(true);
    } else {
      alert(
        "You must be friends to message. Friend request pending or send one first."
      );
    }
  };
  const getButtonText = (personId) => {
    if (isFriend(personId)) return "Message";
    if (hasPendingOutgoing(personId)) return "Pending";
    return "Send Friend Request";
  };
  const getButtonProps = (personId) => {
    const person = directory.find((p) => p.id === personId);
    if (!person) {
      console.error("Person not found for ID:", personId);
      return {
        disabled: true,
        className: "bg-gray-500 text-gray-300 cursor-not-allowed",
        icon: Clock,
      };
    }
    if (isFriend(personId)) {
      return {
        onClick: () => handleMessage(person),
        className: "bg-blue-500 hover:bg-blue-600 text-white",
        icon: MessageSquare,
      };
    } else if (hasPendingOutgoing(personId)) {
      return {
        disabled: true,
        className: "bg-gray-500 text-gray-300 cursor-not-allowed",
        icon: Clock,
      };
    } else {
      return {
        onClick: () => handleSendRequest(personId),
        className: "bg-green-500 hover:bg-green-600 text-white",
        icon: UserPlus,
      };
    }
  };
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-white text-3xl font-bold">Directory</h1>
          <p className="text-gray-400 mt-2">
            Connect with classmates and instructors ({directory.length} total
            users)
          </p>
        </div>
        <button
          onClick={resetStore}
          className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-4 py-2 rounded-lg font-semibold flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reset Store</span>
        </button>
      </div>
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center space-x-2">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search directory... (try 'Admin')"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPeople.map((person) => {
          const buttonProps = getButtonProps(person.id);
          const ButtonIcon = buttonProps.icon || UserPlus;
          return (
            <div
              key={person.id}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-8 h-8 text-gray-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-white font-semibold text-lg">
                      {person.name}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        person.role === "Instructor"
                          ? "bg-yellow-500 text-gray-900"
                          : person.role === "Teaching Assistant"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-700 text-gray-300"
                      }`}
                    >
                      {person.role}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">
                    {person.cohort || person.specialty}
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <Mail className="w-4 h-4" />
                      <span>{person.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <Github className="w-4 h-4" />
                      <span>{person.github}</span>
                    </div>
                  </div>
                  <button
                    {...buttonProps}
                    className={`mt-4 w-full py-2 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2 ${buttonProps.className}`}
                    disabled={buttonProps.disabled}
                  >
                    <ButtonIcon className="w-4 h-4" />
                    <span>{getButtonText(person.id)}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {filteredPeople.length === 0 && searchTerm.trim() && (
        <div className="text-center py-12">
          <p className="text-gray-400">
            No results found for "{searchTerm}". Directory has{" "}
            {directory.length} users—try "Admin", "Instructor", or clear search.
            Check console for details.
          </p>
        </div>
      )}
      {searchTerm.trim() === "" && (
        <div className="text-center py-12 text-gray-400">
          <p>
            Start typing to search (e.g., "Admin" for the administrator). Total
            users: {directory.length}.
          </p>
        </div>
      )}
      {isChatOpen && selectedUser && (
        <ChatModal
          onClose={() => setIsChatOpen(false)}
          otherUser={selectedUser}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};
export default Directory;
