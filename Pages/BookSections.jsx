// Complete fixed BookSession.jsx
import React, { useState } from "react";
import { Calendar, Clock, Video, User, CheckCircle, X } from "lucide-react";
import useManageStore from "../src/Store/useManageStore";
const BookSession = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [sessionType, setSessionType] = useState("1-on-1 Mentorship");
  const [instructorPreference, setInstructorPreference] =
    useState("Any Available");
  const [notes, setNotes] = useState("");
  const { sessions, addSession, addNotification } = useManageStore();
  // Filter upcoming approved/started sessions for the student (ID: 1)
  const studentId = 1;
  const now = new Date();
  const isFutureSession = (session) => {
    const sessionTime = new Date(`${session.date}T${session.time}:00`);
    return sessionTime > now;
  };
  const upcomingSessions = sessions.filter(
    (s) =>
      s.studentId === studentId &&
      (s.status === "approved" || s.status === "started") &&
      isFutureSession(s)
  );
  // Formatting functions
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(":");
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };
  // Get current date and time for minimum constraints
  const today = new Date().toISOString().split("T")[0];
  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  });
  const handleBookSession = (e) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime || !sessionType) {
      alert("Please select date, time, and session type.");
      return;
    }
    // Validate that the selected time is not in the past for today's date
    const now = new Date();
    const selectedDateTime = new Date(`${selectedDate}T${selectedTime}:00`);
    if (selectedDate === today && selectedDateTime < now) {
      alert("Cannot book a session in the past. Please select a future time.");
      return;
    }
    const sessionData = {
      id: Date.now(),
      title: sessionType,
      instructor: instructorPreference,
      date: selectedDate,
      time: selectedTime,
      duration: "30 min",
      status: "pending", // Initially pending for admin approval
      studentId,
      notes,
      zoomLink: null, // Generated later by admin
    };
    addSession(sessionData);
    // FIXED: Add self-notification for student
    const newNotifForStudent = {
      id: Date.now() + 1,
      userId: studentId,
      type: "session_booked_self",
      sessionId: sessionData.id,
      message: `Session "${sessionType}" booked for ${selectedDate} at ${selectedTime}`,
      read: false,
      timestamp: new Date().toISOString(),
    };
    addNotification(newNotifForStudent);
    alert("Session booked! Waiting for admin approval.");
    // Reset form
    setSelectedDate("");
    setSelectedTime("");
    setSessionType("1-on-1 Mentorship");
    setInstructorPreference("Any Available");
    setNotes("");
  };
  const handleJoinSession = (session) => {
    if (session.zoomLink) {
      window.open(session.zoomLink, "_blank");
    } else {
      alert(
        "Session not started yet or no Zoom link provided. Check back later."
      );
    }
  };
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-white text-3xl font-bold">Book a Session</h1>
          <p className="text-gray-400 mt-2">
            Schedule mentorship and review sessions
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-white text-lg font-semibold mb-4">
            Upcoming Sessions
          </h3>
          <div className="space-y-4">
            {upcomingSessions.map((session) => (
              <div
                key={session.id}
                className="bg-gray-900 rounded-lg p-4 border border-gray-700"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-white font-semibold">
                      {session.title}
                    </h4>
                    <p className="text-gray-400 text-sm">
                      with {session.instructor}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      session.status === "approved"
                        ? "bg-green-500 text-white"
                        : "bg-blue-500 text-white"
                    }`}
                  >
                    {session.status.toUpperCase()}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(session.date)}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>
                      {formatTime(session.time)} ({session.duration})
                    </span>
                  </div>
                  {session.notes && (
                    <div className="text-gray-400">Notes: {session.notes}</div>
                  )}
                  {session.zoomLink && (
                    <div className="text-blue-400">
                      Zoom:{" "}
                      <a
                        href={session.zoomLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {session.zoomLink}
                      </a>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleJoinSession(session)}
                  disabled={session.status !== "started" || !session.zoomLink}
                  className="mt-3 w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-600 text-gray-900 px-4 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                >
                  <Video className="w-4 h-4" />
                  <span>
                    {session.status === "started" && session.zoomLink
                      ? "Join Session"
                      : "Pending Start"}
                  </span>
                </button>
              </div>
            ))}
            {upcomingSessions.length === 0 && (
              <p className="text-gray-400 text-center">No upcoming sessions.</p>
            )}
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-white text-lg font-semibold mb-4">
            Book New Session
          </h3>
          <form onSubmit={handleBookSession} className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Session Type *
              </label>
              <select
                value={sessionType}
                onChange={(e) => setSessionType(e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-yellow-500"
                required
              >
                <option>1-on-1 Mentorship</option>
                <option>Code Review</option>
                <option>Career Guidance</option>
                <option>Technical Help</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Select Date *
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={today}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-yellow-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Select Time *
              </label>
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                min={selectedDate === today ? currentTime : undefined}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-yellow-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Instructor Preference
              </label>
              <select
                value={instructorPreference}
                onChange={(e) => setInstructorPreference(e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-yellow-500"
              >
                <option>Emma Wilson</option>
                <option>Lisa Anderson</option>
                <option>Any Available</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-yellow-500 resize-none"
                rows="3"
                placeholder="What would you like to discuss?"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Book Session
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default BookSession;
