import React, { useState } from "react";
import { Search, Filter, BookOpen, ExternalLink, Tag } from "lucide-react";
import useManageStore from "../src/Store/useManageStore";


const ResourceLibrary = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { resources, addResource } = useManageStore();

  const filteredResources = resources.filter(
    (resource) =>
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-3xl font-bold">Resource Library</h1>
          <p className="text-gray-400 mt-2">
            Curated learning resources and materials
          </p>
        </div>
        <button
          onClick={() => {
            // For demonstration, adding a resource directly; in practice, this could open a modal
            addResource({
              id: Date.now(),
              title: "New Resource",
              type: "Article",
              category: "General",
              description: "Newly added resource",
              link: "#",
            });
          }}
          className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-6 py-2 rounded-lg font-semibold transition-colors"
        >
          Add Resource
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex-1 bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
            />
          </div>
        </div>
        <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-4 rounded-lg border border-gray-700 transition-colors">
          <Filter className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredResources.map((resource, index) => (
          <div
            key={index}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-gray-600 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <BookOpen className="w-6 h-6 text-yellow-500" />
                <div>
                  <h3 className="text-white font-semibold text-lg">
                    {resource.title}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <Tag className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-400 text-xs">
                      {resource.category}
                    </span>
                  </div>
                </div>
              </div>
              <span className="bg-gray-700 text-gray-300 px-2 py-1 rounded text-xs font-semibold">
                {resource.type}
              </span>
            </div>

            <p className="text-gray-400 text-sm mb-3">{resource.description}</p>

            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-xs">
                {resource.duration ||
                  resource.readTime ||
                  resource.pages ||
                  "Available"}
              </span>
              <button className="text-yellow-500 hover:text-yellow-400 transition-colors flex items-center space-x-1">
                <span className="text-sm font-semibold">Access</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">
            No resources found matching your search.
          </p>
        </div>
      )}
    </div>
  );
};

export default ResourceLibrary;
