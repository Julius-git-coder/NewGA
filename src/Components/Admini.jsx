// Admini.jsx
import React from "react";
import {
  Bell,
  Calendar,
  Edit,
  Trash2,
  Settings,
  X,
  TrendingUp,
} from "lucide-react";

const Admini = ({
  stats,
  StatIcon,
  activeTab,
  setActiveTab,
  selectedForm,
  setSelectedForm,
  setFormData,
  formData,
  handleFormChange,
  handleFormSubmit,
  renderForm,
  getFormTitle,
  events,
  handleEditEvent,
  deleteEvent,
  pendingActions,
  announcements,
  handleEditAnnouncement,
  deleteAnnouncement,
}) => {
  return (
    <>
      {/* Dashboard Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-white text-3xl font-bold">
            Administrator Dashboard
          </h1>
          <p className="text-gray-400 mt-2">
            Manage students, assignments, exercises, roadmap, and system
            settings
          </p>
        </div>
        <div className="flex items-center space-x-3 flex-wrap gap-2">
          <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-700 transition-colors flex items-center space-x-2">
            <Bell className="w-4 h-4" />
            <span>Notifications</span>
          </button>
          <select
            value={selectedForm}
            onChange={(e) => {
              setSelectedForm(e.target.value);
              setFormData({});
            }}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700"
          >
            <option value="">Select Content Type</option>
            <option value="announcement">New Announcement</option>
            <option value="assignment">New Assignment</option>
            <option value="exercise">New Exercise</option>
            <option value="project">New Project</option>
            <option value="event">New Event</option>
            <option value="attendance">New Attendance</option>
            <option value="roadmap">New Roadmap Item</option>
            <option value="week">New Week</option>
            <option value="subtopic">New Subtopic</option>
            <option value="classmaterial">New Class Material</option>
            <option value="program">New Program</option>
            <option value="milestone">New Milestone</option>
          </select>
          <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-700 transition-colors flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>
      </div>

      {/* Form Modal */}
      {selectedForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-8 border border-gray-700 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white text-2xl font-bold">
                {getFormTitle(selectedForm, !!formData.id)}
              </h2>
              <button
                onClick={() => {
                  setSelectedForm("");
                  setFormData({});
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleFormSubmit}>
              {renderForm()}
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedForm("");
                    setFormData({});
                  }}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-6 py-2 rounded-lg font-semibold"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          >
            <div className="flex items-center justify-between mb-3">
              <StatIcon icon={stat.icon} color={stat.color} />
              <TrendingUp className="w-4 h-4 text-gray-400" />
            </div>
            <h3 className="text-white text-3xl font-bold mb-1">{stat.value}</h3>
            <p className="text-gray-400 text-sm">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="bg-gray-800 rounded-lg p-2 border border-gray-700">
        <div className="flex space-x-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap ${
              activeTab === "overview"
                ? "bg-yellow-500 text-gray-900"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("announcements")}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap ${
              activeTab === "announcements"
                ? "bg-yellow-500 text-gray-900"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Announcements
          </button>
          <button
            onClick={() => setActiveTab("assignments")}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap ${
              activeTab === "assignments"
                ? "bg-yellow-500 text-gray-900"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Assignments
          </button>
          <button
            onClick={() => setActiveTab("exercises")}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap ${
              activeTab === "exercises"
                ? "bg-yellow-500 text-gray-900"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Exercises
          </button>
          <button
            onClick={() => setActiveTab("projects")}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap ${
              activeTab === "projects"
                ? "bg-yellow-500 text-gray-900"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => setActiveTab("attendance")}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap ${
              activeTab === "attendance"
                ? "bg-yellow-500 text-gray-900"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Attendance
          </button>
          <button
            onClick={() => setActiveTab("roadmap")}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap ${
              activeTab === "roadmap"
                ? "bg-yellow-500 text-gray-900"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Roadmap
          </button>
          <button
            onClick={() => setActiveTab("classmaterials")}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap ${
              activeTab === "classmaterials"
                ? "bg-yellow-500 text-gray-900"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Class Materials
          </button>
          <button
            onClick={() => setActiveTab("programs")}
            className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap ${
              activeTab === "programs"
                ? "bg-yellow-500 text-gray-900"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Programs
          </button>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-white text-lg font-semibold mb-4 flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-yellow-500" />
              <span>Upcoming Events</span>
            </h3>
            <div className="space-y-3">
              {events.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">
                  No events scheduled
                </p>
              ) : (
                events.map((event) => (
                  <div
                    key={event.id}
                    className="bg-gray-900 rounded-lg p-4 border border-gray-700"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-semibold">
                          {event.event}
                        </h4>
                        <p className="text-gray-400 text-sm">
                          {event.date} at {event.time}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditEvent(event)}
                          className="text-yellow-500 hover:text-yellow-400"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteEvent(event.id)}
                          className="text-red-500 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <button
              onClick={() => {
                setSelectedForm("event");
                setFormData({});
              }}
              className="mt-4 w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              Add Event
            </button>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-white text-lg font-semibold mb-4 flex items-center space-x-2">
              <Bell className="w-5 h-5 text-yellow-500" />
              <span>Pending Actions</span>
            </h3>
            {pendingActions.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">
                No pending actions
              </p>
            ) : (
              <div className="space-y-3">
                {pendingActions.map((action) => (
                  <div
                    key={action.id}
                    className="bg-gray-900 rounded-lg p-4 border border-gray-700"
                  >
                    <p className="text-white font-semibold">{action.type}</p>
                    <p className="text-gray-400 text-sm">
                      {action.student} - {action.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Announcements Tab */}
      {activeTab === "announcements" && (
        <div className="space-y-4">
          <h3 className="text-white text-lg font-semibold mb-4 flex items-center space-x-2">
            <Bell className="w-5 h-5 text-yellow-500" />
            <span>Announcements</span>
          </h3>
          {announcements.length === 0 ? (
            <div className="bg-gray-800 rounded-lg p-12 border border-gray-700 text-center">
              <p className="text-gray-400 text-lg">
                No announcements available
              </p>
            </div>
          ) : (
            announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="bg-gray-900 rounded-lg p-4 border border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="text-white font-semibold">
                      {announcement.title}
                    </h4>
                    <p className="text-gray-400 text-sm">
                      {announcement.content}
                    </p>
                    <p className="text-gray-500 text-xs mt-2">
                      {announcement.date} at {announcement.time} by{" "}
                      {announcement.author}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditAnnouncement(announcement)}
                      className="text-yellow-500 hover:text-yellow-400"
                      title="Edit Announcement"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteAnnouncement(announcement.id)}
                      className="text-red-500 hover:text-red-400"
                      title="Delete Announcement"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
          <button
            onClick={() => {
              setSelectedForm("announcement");
              setFormData({});
            }}
            className="mt-4 w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            Add Announcement
          </button>
        </div>
      )}
    </>
  );
};

export default Admini;
