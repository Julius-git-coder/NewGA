import React, { useState } from "react";
import {
  Users,
  MessageSquare,
  ThumbsUp,
  Send,
  Image,
  Paperclip,
} from "lucide-react";
import useManageStore from "../src/Store/useManageStore";


const CampusConnect = () => {
  const [newPost, setNewPost] = useState("");
  const { posts, addPost } = useManageStore();

  const handlePostSubmit = () => {
    if (newPost.trim()) {
      addPost({
        id: Date.now(),
        author: "Current User", // Replace with actual user
        timestamp: new Date().toISOString(),
        content: newPost,
        likes: 0,
        comments: 0,
      });
      setNewPost("");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-white text-3xl font-bold">Campus Connect</h1>
        <p className="text-gray-400 mt-2">
          Connect and collaborate with your peers
        </p>
      </div>

      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6 text-gray-400" />
          </div>
          <div className="flex-1">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Share something with your classmates..."
              className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-yellow-500 resize-none"
              rows="3"
            />
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-2">
                <button className="text-gray-400 hover:text-yellow-500 transition-colors p-2">
                  <Image className="w-5 h-5" />
                </button>
                <button className="text-gray-400 hover:text-yellow-500 transition-colors p-2">
                  <Paperclip className="w-5 h-5" />
                </button>
              </div>
              <button
                onClick={handlePostSubmit}
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-6 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Post</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-gray-800 rounded-lg p-6 border border-gray-700"
          >
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-gray-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-white font-semibold">
                        {post.author}
                      </h3>
                      {post.role && (
                        <span className="bg-yellow-500 text-gray-900 px-2 py-0.5 rounded-full text-xs font-semibold">
                          {post.role}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm">{post.timestamp}</p>
                  </div>
                </div>
                <p className="text-gray-300 mb-4">{post.content}</p>
                <div className="flex items-center space-x-6 text-sm">
                  <button className="flex items-center space-x-2 text-gray-400 hover:text-yellow-500 transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                    <span>{post.likes} likes</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-400 hover:text-yellow-500 transition-colors">
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.comments} comments</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No posts available.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampusConnect;
