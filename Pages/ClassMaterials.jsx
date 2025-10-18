import React from "react";
import { BookOpen, CheckCircle, Download, ExternalLink } from "lucide-react";
import useManageStore from "../src/Store/useManageStore";

const ClassMaterials = () => {
  const { classMaterials } = useManageStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-white text-3xl font-bold">Class Materials</h1>
        <p className="text-gray-400 mt-2">
          Access course materials and resources
        </p>
      </div>

      <div className="space-y-4">
        {classMaterials.map((material) => (
          <div
            key={material.id}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <BookOpen className="w-6 h-6 text-yellow-500" />
                  <h3 className="text-white text-xl font-semibold">
                    {material.title}
                  </h3>
                </div>
                <span className="inline-block bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-xs font-semibold">
                  Week {material.week}
                </span>
              </div>
              <span className="text-gray-400 text-sm">
                {material.resources} resources
              </span>
            </div>

            <div className="space-y-2 mb-4">
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
          </div>
        ))}
        {classMaterials.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No class materials available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassMaterials;
