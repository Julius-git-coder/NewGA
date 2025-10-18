// Fixed Profile.jsx - Use directory and updateUser for consistency with admin uploads
import React, { useState, useMemo } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Edit,
  Save,
  LogOut,
  GraduationCap,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useManageStore from "../src/Store/useManageStore"; // Adjust path if needed

const uploadToCloudinary = async (file) => {
  const cloudName = "dpttonwcs"; // Replace with your Cloudinary cloud name
  const uploadPreset = "Julius"; // Replace with your Cloudinary unsigned upload preset
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

const Profile = ({ onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { directory, updateUser } = useManageStore();
  const studentId = 1; // Fixed: Use number for consistency with store IDs
  const studentProfile = useMemo(
    () => directory.find((u) => u.id === studentId),
    [directory]
  );

  const navigate = useNavigate();

  const handleChange = (field, value) => {
    updateUser(studentId, { [field]: value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    const imageUrl = await uploadToCloudinary(file);
    if (imageUrl) {
      updateUser(studentId, { pictureUrl: imageUrl });
      // Clear the input
      e.target.value = "";
      alert("Profile picture updated successfully!");
    } else {
      alert("Failed to upload image. Please try again.");
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    // Optional: Show success toast instead of alert
    alert("Profile saved successfully!");
  };

  const handleLogout = () => {
    if (showConfirm) {
      if (onLogout) onLogout();
      navigate("/login");
      setShowConfirm(false);
    } else {
      setShowConfirm(true);
      // Reset confirmation after 3 seconds if not clicked again
      setTimeout(() => setShowConfirm(false), 3000);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      handleSave(); // Auto-save on toggle out of edit mode
    } else {
      setIsEditing(true);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-3xl font-bold">Profile</h1>
          <p className="text-gray-400 mt-2">Manage your personal information</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleEditToggle}
            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 px-6 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
          >
            {isEditing ? (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            ) : (
              <>
                <Edit className="w-4 h-4" />
                <span>Edit Profile</span>
              </>
            )}
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>{showConfirm ? "Confirm Logout" : "Logout"}</span>
          </button>
        </div>
      </div>

      {showConfirm && (
        <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded">
          Are you sure you want to log out? Click the button again to confirm.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex flex-col items-center">
              <div className="relative mb-4 group">
                {studentProfile?.pictureUrl ? (
                  <img
                    src={studentProfile.pictureUrl}
                    alt="Profile Picture"
                    className="w-32 h-32 rounded-full object-cover border-2 border-gray-600 group-hover:border-yellow-500 transition-colors cursor-pointer"
                  />
                ) : (
                  <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center border-2 border-dashed border-gray-600 group-hover:border-yellow-500 transition-colors cursor-pointer">
                    <User className="w-16 h-16 text-gray-400" />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-full"
                />
                {isEditing && (
                  <div className="absolute inset-0 rounded-full bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs">Upload Photo</span>
                  </div>
                )}
              </div>
              <h2 className="text-white text-xl font-bold mb-1">
                {studentProfile?.name || "Unknown User"}
              </h2>
              <span className="bg-yellow-500 text-gray-900 px-3 py-1 rounded-full text-xs font-semibold mb-4">
                {studentProfile?.cohort || "N/A"}
              </span>
              <p className="text-gray-400 text-center text-sm mb-4">
                {studentProfile?.bio || "No bio available"}
              </p>
              <div className="w-full space-y-2">
                <div className="flex items-center justify-center space-x-2 text-gray-400 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{studentProfile?.location || "Not specified"}</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-gray-400 text-sm">
                  <span>Joined {studentProfile?.startDate || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-white text-lg font-semibold mb-6">
              Personal Information
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={studentProfile?.name || ""}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-yellow-500"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 text-white">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>{studentProfile?.name || "Not set"}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={studentProfile?.email || ""}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-yellow-500"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 text-white">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{studentProfile?.email || "Not set"}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={studentProfile?.phone || ""}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-yellow-500"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 text-white">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{studentProfile?.phone || "Not set"}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    Student ID
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={studentProfile?.studentId || ""}
                      onChange={(e) =>
                        handleChange("studentId", e.target.value)
                      }
                      className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-yellow-500"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 text-white">
                      <GraduationCap className="w-4 h-4 text-gray-400" />
                      <span>{studentProfile?.studentId || "Not set"}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    Cohort
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={studentProfile?.cohort || ""}
                      onChange={(e) => handleChange("cohort", e.target.value)}
                      className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-yellow-500"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 text-white">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{studentProfile?.cohort || "Not set"}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">
                    Location
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={studentProfile?.location || ""}
                      onChange={(e) => handleChange("location", e.target.value)}
                      className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-yellow-500"
                    />
                  ) : (
                    <div className="flex items-center space-x-2 text-white">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span>{studentProfile?.location || "Not set"}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">Bio</label>
                {isEditing ? (
                  <textarea
                    value={studentProfile?.bio || ""}
                    onChange={(e) => handleChange("bio", e.target.value)}
                    className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-yellow-500 resize-none"
                    rows="3"
                  />
                ) : (
                  <p className="text-white">
                    {studentProfile?.bio || "No bio available"}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mt-6">
            <h3 className="text-white text-lg font-semibold mb-6">
              Social Links
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  GitHub Username
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={studentProfile?.github || ""}
                    onChange={(e) => handleChange("github", e.target.value)}
                    className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-yellow-500"
                  />
                ) : (
                  <div className="flex items-center space-x-2 text-white">
                    <Github className="w-4 h-4 text-gray-400" />
                    <span>
                      {studentProfile?.github
                        ? `github.com/${studentProfile.github}`
                        : "Not set"}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-gray-400 text-sm mb-2">
                  LinkedIn Username
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={studentProfile?.linkedin || ""}
                    onChange={(e) => handleChange("linkedin", e.target.value)}
                    className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-yellow-500"
                  />
                ) : (
                  <div className="flex items-center space-x-2 text-white">
                    <Linkedin className="w-4 h-4 text-gray-400" />
                    <span>
                      {studentProfile?.linkedin
                        ? `linkedin.com/in/${studentProfile.linkedin}`
                        : "Not set"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
