import React, { useState, useEffect } from "react";
import {
  Map,
  CheckCircle,
  Circle,
  Clock,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import useManageStore from "../src/Store/useManageStore";

const RoadMap = () => {
  const roadmapItems = useManageStore((state) => state.roadmapItems);
  const [expandedWeeks, setExpandedWeeks] = useState({});

  // Debug: Log roadmap items whenever they change
  useEffect(() => {
    console.log("RoadMap: Current roadmapItems:", roadmapItems);
    roadmapItems.forEach((item) => {
      console.log(`RoadMap: Item ${item.id} weeks:`, item.weeks);
      item.weeks?.forEach((week, idx) => {
        console.log(`RoadMap: Week ${idx} sub-topics:`, week.subTopics);
      });
    });
  }, [roadmapItems]);

  const toggleWeek = (roadmapId, weekIndex) => {
    const key = `${roadmapId}-${weekIndex}`;
    setExpandedWeeks((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const isExpanded = (roadmapId, weekIndex) => {
    return expandedWeeks[`${roadmapId}-${weekIndex}`] || false;
  };

  // Group roadmap items by term
  const groupedByTerm = roadmapItems.reduce((acc, item) => {
    if (!acc[item.term]) {
      acc[item.term] = [];
    }
    acc[item.term].push(item);
    return acc;
  }, {});

  // Helper function to safely get sub-topics
  const getSubTopics = (week) => {
    return week.subTopics || [];
  };

  return (
    <div className="space-y-6 bg-gray-900 min-h-screen p-6">
      <div>
        <h1 className="text-white text-3xl font-bold">Learning Roadmap</h1>
        <p className="text-gray-400 mt-2">
          Your structured path to becoming a full-stack developer
        </p>
      </div>

      {/* Current Week Highlight */}
      {roadmapItems.map((item) =>
        item.weeks
          .filter((week) => week.current)
          .map((week, idx) => (
            <div
              key={`current-${item.id}-${idx}`}
              className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border-2 border-yellow-500 rounded-lg p-6"
            >
              <div className="flex items-center space-x-3 mb-3">
                <Clock className="w-6 h-6 text-yellow-500" />
                <h2 className="text-white text-xl font-bold">This Week</h2>
              </div>
              <h3 className="text-white text-lg font-semibold mb-2">
                Week {week.weekNumber || week.week}: {week.topic}
              </h3>
              <div className="bg-gray-800/50 rounded-lg p-4 mt-3">
                <p className="text-gray-300 text-sm font-semibold mb-2">
                  Sub-topics:
                </p>
                {getSubTopics(week).length > 0 ? (
                  <ul className="space-y-2">
                    {getSubTopics(week).map((subTopic) => (
                      <li
                        key={subTopic.id}
                        className="flex items-center space-x-2 text-gray-300"
                      >
                        {subTopic.completed ? (
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        ) : (
                          <Circle className="w-4 h-4 text-gray-500 flex-shrink-0" />
                        )}
                        <span
                          className={
                            subTopic.completed
                              ? "line-through text-gray-500"
                              : ""
                          }
                        >
                          {subTopic.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 text-sm">No sub-topics yet</p>
                )}
              </div>
            </div>
          ))
      )}

      {/* Next Week Preview */}
      {roadmapItems.map((item) =>
        item.weeks
          .filter((week) => week.next)
          .map((week, idx) => (
            <div
              key={`next-${item.id}-${idx}`}
              className="bg-gray-800 border border-blue-500/50 rounded-lg p-6"
            >
              <div className="flex items-center space-x-3 mb-3">
                <Clock className="w-6 h-6 text-blue-500" />
                <h2 className="text-white text-xl font-bold">Next Week</h2>
              </div>
              <h3 className="text-white text-lg font-semibold mb-2">
                Week {week.weekNumber || week.week}: {week.topic}
              </h3>
              <div className="bg-gray-900 rounded-lg p-4 mt-3">
                <p className="text-gray-300 text-sm font-semibold mb-2">
                  Upcoming sub-topics:
                </p>
                {getSubTopics(week).length > 0 ? (
                  <ul className="space-y-2">
                    {getSubTopics(week).map((subTopic) => (
                      <li
                        key={subTopic.id}
                        className="flex items-center space-x-2 text-gray-400"
                      >
                        <Circle className="w-4 h-4 text-gray-600 flex-shrink-0" />
                        <span>{subTopic.name}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 text-sm">No sub-topics yet</p>
                )}
              </div>
            </div>
          ))
      )}

      {/* All Terms and Roadmap */}
      <div className="space-y-6">
        {Object.entries(groupedByTerm).map(([term, items]) => (
          <div key={term} className="space-y-4">
            <h2 className="text-white text-2xl font-bold border-b border-gray-700 pb-2">
              {term}
            </h2>
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-gray-800 rounded-lg p-6 border border-gray-700"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Map className="w-6 h-6 text-yellow-500" />
                    <h3 className="text-white text-xl font-semibold">
                      {item.phase}
                    </h3>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.status === "completed"
                        ? "bg-green-500 text-white"
                        : item.status === "in-progress"
                        ? "bg-yellow-500 text-gray-900"
                        : "bg-gray-700 text-gray-300"
                    }`}
                  >
                    {item.status.toUpperCase().replace("-", " ")}
                  </span>
                </div>

                <div className="space-y-2">
                  {item.weeks && item.weeks.length > 0 ? (
                    item.weeks.map((week, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-900 rounded-lg border border-gray-700"
                      >
                        <div
                          onClick={() => toggleWeek(item.id, idx)}
                          className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-800 transition-colors"
                        >
                          <div className="flex items-center space-x-4">
                            {getSubTopics(week).length > 0 &&
                            getSubTopics(week).every((st) => st.completed) ? (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : week.current ? (
                              <Clock className="w-5 h-5 text-yellow-500" />
                            ) : (
                              <Circle className="w-5 h-5 text-gray-600" />
                            )}
                            <div>
                              <p className="text-white font-medium">
                                Week {week.weekNumber || week.week}
                              </p>
                              <p className="text-gray-400 text-sm">
                                {week.topic}
                              </p>
                            </div>
                          </div>
                          {isExpanded(item.id, idx) ? (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          )}
                        </div>

                        {isExpanded(item.id, idx) && (
                          <div className="px-4 pb-4 space-y-2">
                            <div className="border-t border-gray-700 pt-3">
                              <p className="text-gray-300 text-sm font-semibold mb-2">
                                Sub-topics:
                              </p>
                              {getSubTopics(week).length > 0 ? (
                                <ul className="space-y-2 pl-9">
                                  {getSubTopics(week).map((subTopic) => (
                                    <li
                                      key={subTopic.id}
                                      className="flex items-center space-x-2"
                                    >
                                      {subTopic.completed ? (
                                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                      ) : (
                                        <Circle className="w-4 h-4 text-gray-600 flex-shrink-0" />
                                      )}
                                      <span
                                        className={`${
                                          subTopic.completed
                                            ? "line-through text-gray-500"
                                            : "text-gray-300"
                                        }`}
                                      >
                                        {subTopic.name}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-gray-400 text-sm pl-9">
                                  No sub-topics yet
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm text-center py-4">
                      No weeks added yet
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
        {roadmapItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No roadmap items available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoadMap;
