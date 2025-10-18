import React, { useEffect } from "react";
import {  Clock, User } from "lucide-react";
import useManageStore from "../src/Store/useManageStore";

const Announcement = () => {
  const announcements = useManageStore((state) => state.announcements);

  useEffect(() => {
    console.log("Announcements in component:", announcements);
  }, [announcements]);

  return (
    <div className="space-y-6 bg-gray-900 min-h-screen p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-3xl font-bold">Announcements</h1>
          <p className="text-gray-400 mt-2">
            Stay updated with the latest news and updates
          </p>
        </div>
      </div>
      <div className="space-y-4">
        {announcements.length === 0 ? (
          <div className="text-center py-12">
          
            <p className="text-gray-400">No announcements available.</p>
          </div>
        ) : (
          announcements.map((announcement) => (
            <div
              key={announcement.id}
              className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        announcement.priority === "high"
                          ? "bg-red-500"
                          : announcement.priority === "medium"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                    />
                    <h3 className="text-white text-lg font-semibold">
                      {announcement.title}
                    </h3>
                  </div>
                  <p className="text-gray-300 mb-4">{announcement.content}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{announcement.author}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>
                        {announcement.date}
                        {announcement.time && ` at ${announcement.time}`}
                      </span>
                    </span>
                  </div>
                </div>
             
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Announcement;
