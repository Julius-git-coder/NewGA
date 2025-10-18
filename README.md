Roadmap
1.React/zustand 
2.Tailwindcss: styling
3.Firebase:authentication
4.MongoDB:data storage
5.Express.js : writing Api's  
6.Cloudinary : for image storage
7.User profiles (students, teachers, parents).

Performance records (grades, test results, progress over time).

Activities (attendance, assignments, participation, extracurriculars).

Notifications/updates (new assignments, events, deadlines).

Analytics (charts, progress reports).

Scalability (if many schools/students join).
Classroom Management System
Overview
This project is a Classroom Management System designed to allow an admin to send exercises, projects, assignments, and announcements to students. The admin can send these to all students at once or to a specific student based on their registered email. Each student has a personalized page where they can view the content sent to them.
Features

Admin Capabilities:
Send exercises, projects, assignments, and announcements to all students.
Select a specific student by their registered email to send targeted content.
Send content to all students simultaneously by selecting the "All" option.


Student Experience:
Each student has a personal page displaying exercises, projects, assignments, and announcements sent to them.
Content is delivered based on the student's registered email.


Email-Based System:
Students sign up with their email, which the admin uses to identify and send content to individual students.



Setup Instructions

Clone the Repository:git clone <repository-url>
cd classroom-management-system


Install Dependencies:Ensure you have a backend (e.g., Node.js, Python) and a database (e.g., MongoDB, MySQL) set up. Install required dependencies:npm install  # For Node.js-based projects
# or
pip install -r requirements.txt  # For Python-based projects


Configure Environment:
Create a .env file in the root directory.
Add necessary configurations (e.g., database connection string, email service credentials).

DATABASE_URL=<your-database-url>
EMAIL_SERVICE=<your-email-service>
EMAIL_USER=<your-email>
EMAIL_PASS=<your-password>


Run the Application:npm start  # For Node.js
# or
python app.py  # For Python



Usage

Admin Actions:
Log in to the admin dashboard.
Navigate to the "Send Content" section.
Choose the content type: Exercise, Project, Assignment, or Announcement.
Select recipient(s): "All" for all students or a specific student's email from the registered list.
Submit the content, which will be sent to the selected student(s) and appear on their personal page(s).


Student Actions:
Sign up with a valid email address.
Access the personal student page via a provided link or login.
View all exercises, projects, assignments, and announcements sent by the admin.



Technology Stack

Frontend: HTML, CSS, JavaScript (optional: React for a dynamic UI)
Backend: Node.js with Express or Python with Flask/Django
Database: MongoDB for storing student emails and content (or MySQL/PostgreSQL)
Email Service: SMTP or third-party service (e.g., SendGrid, Nodemailer)

Project Structure
classroom-management-system/
├── public/                # Static files (CSS, JS, images)
├── src/
│   ├── controllers/       # Logic for handling admin and student actions
│   ├── models/            # Database models (e.g., Student, Content)
│   ├── routes/            # API routes for sending content
│   └── views/             # Frontend templates (if using server-side rendering)
├── .env                   # Environment variables
├── README.md              # This file
└── package.json           # Node.js dependencies (or requirements.txt for Python)

Future Enhancements

Add authentication for secure admin and student access.
Implement real-time notifications for new content.
Allow students to submit assignments through their personal page.
Add support for file uploads (e.g., PDFs for assignments).

Contributing
Contributions are welcome! Please fork the repository and submit a pull request with your changes.
License
This project is licensed under the MIT License.

<!-- image kit  learn that later--




import React, { useState, useEffect } from "react";
import { Users, BookOpen, TrendingUp } from "lucide-react";
import useManageStore from "../Store/useManageStore";
import Admini from "./Admini";
import Administra from "./Administra";
import Adminis from "./Adminis";

const Administrator = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedForm, setSelectedForm] = useState("");
  const [formData, setFormData] = useState({});

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
  const friendRequests = useManageStore((state) => state.friendRequests);
  const directory = useManageStore((state) => state.directory);

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
  const acceptFriendRequest = useManageStore((state) => state.acceptFriendRequest);
  const rejectFriendRequest = useManageStore((state) => state.rejectFriendRequest);

  // Debug log
  useEffect(() => {
    console.log("Administrator - Announcements:", announcements);
    console.log("Administrator - Assignments:", assignments);
    console.log("Administrator - Exercises:", exercises);
    console.log("Administrator - Projects:", projects);
    console.log("Administrator - Attendance:", attendance);
    console.log("Administrator - Roadmap Items:", roadmapItems);
    console.log("Administrator - Class Materials:", classMaterials);
    console.log("Administrator - Programs:", programs);
  }, [
    announcements,
    assignments,
    exercises,
    projects,
    attendance,
    roadmapItems,
    classMaterials,
    programs,
  ]);

  const recentStudents = [
    {
      id: 1,
      name: "Julius Dagana",
      email: "julius@example.com",
      cohort: "2024-B",
      status: "active",
      attendance: 92,
    },
  ];

  const stats = [
    { label: "Total Students", value: "156", icon: Users, color: "yellow" },
    { label: "Active Courses", value: "8", icon: BookOpen, color: "blue" },
  ];

  const pendingActions = [
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
  ];

  const adminId = 2; // Hardcoded admin ID

  const pendingFriendRequests = friendRequests.filter(
    (r) => r.toId === adminId && r.status === "pending"
  );

  const getStudentName = (studentId) => {
    return recentStudents.find((s) => s.id === studentId)?.name || `Student ${studentId}`;
  };

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
        if (!formData.title || !formData.points || !formData.studentId) {
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
        if (!formData.title || !formData.points || !formData.studentId) {
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
        addWeekToRoadmap(formData.roadmapId, weekNumber, formData.topic);
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
        addSubTopicToWeek(formData.roadmapId, weekIndex, formData.subTopicName);
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
          alert("Please enter a valid number for total milestones.");
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
                Student ID * (Enter 1 for Julius Dagana)
              </label>
              <input
                type="number"
                value={formData.studentId || ""}
                onChange={(e) => handleFormChange("studentId", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                placeholder="1"
                required
              />
              <p className="text-gray-500 text-xs mt-1">
                Current student: Julius Dagana (ID: 1)
              </p>
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
                Student ID * (Enter 1 for Julius Dagana)
              </label>
              <input
                type="number"
                value={formData.studentId || ""}
                onChange={(e) => handleFormChange("studentId", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                placeholder="1"
                required
              />
              <p className="text-gray-500 text-xs mt-1">
                Current student: Julius Dagana (ID: 1)
              </p>
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
                Student ID * (Enter 1 for Julius Dagana)
              </label>
              <input
                type="number"
                value={formData.studentId || ""}
                onChange={(e) => handleFormChange("studentId", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                placeholder="1"
                required
              />
              <p className="text-gray-500 text-xs mt-1">
                Current student: Julius Dagana (ID: 1)
              </p>
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
                Student ID * (Enter 1 for Julius Dagana)
              </label>
              <input
                type="number"
                value={formData.studentId || ""}
                onChange={(e) => handleFormChange("studentId", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                placeholder="1"
                required
              />
              <p className="text-gray-500 text-xs mt-1">
                Current student: Julius Dagana (ID: 1)
              </p>
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
                value={formData.phase || ""}
                onChange={(e) => handleFormChange("phase", e.target.value)}
                className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg px-4 py-2 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-2">Term *</label>
              <input
                type="text"
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

  const handleAcceptFriendRequest = (requestId) => {
    acceptFriendRequest(requestId);
    alert("Friend request accepted!");
  };

  const handleRejectFriendRequest = (requestId) => {
    rejectFriendRequest(requestId);
    alert("Friend request rejected!");
  };

  return (
    <div className="space-y-6 bg-gray-900 min-h-screen p-6">
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
      {activeTab === "friends" && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 space-y-4">
          <h2 className="text-white text-xl font-bold mb-4">Manage Friend Requests</h2>
          {pendingFriendRequests.length > 0 ? (
            pendingFriendRequests.map((req) => (
              <div
                key={req.id}
                className="flex justify-between items-center p-4 bg-gray-700 rounded mb-2"
              >
                <span className="text-white">
                  Friend request from {getStudentName(req.fromId)} (ID: {req.fromId})
                </span>
                <div className="space-x-2">
                  <button
                    onClick={() => handleAcceptFriendRequest(req.id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleRejectFriendRequest(req.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No pending friend requests.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Administrator;

// Fixed useManageStore.js - Added missing fields to directory initial state for consistency
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
const useManageStore = create(
  persist(
    (set, get) => ({
      // Initial directory data - Updated with all profile fields for consistency across views
      directory: [
        {
          id: "1", // Changed to string for consistency
          name: "Julius Dagana",
          email: "julius@example.com",
          role: "Student",
          github: "juliusdagana",
          linkedin: "juliusdagana",
          phone: "+233 24 123 4567",
          location: "Accra, Ghana",
          bio: "Full-stack developer in training with a passion for building web applications.",
          cohort: "2024-B",
          startDate: "August 2024",
          studentId: "1",
          pictureUrl:
            "https://via.placeholder.com/150x150/4F46E5/FFFFFF?text=JD",
        },
        {
          id: "2", // Changed to string
          name: "Admin",
          email: "admin@gradea.com",
          role: "Administrator",
          github: "admin",
          linkedin: "",
          phone: "",
          location: "",
          bio: "",
          cohort: "Staff",
          startDate: "",
          studentId: "",
          pictureUrl: "",
        },
        {
          id: "3",
          name: "Instructor Smith",
          email: "smith@example.com",
          role: "Instructor",
          github: "smith",
          linkedin: "",
          phone: "",
          location: "",
          bio: "",
          cohort: "",
          startDate: "",
          studentId: "",
          pictureUrl: "",
          specialty: "Web Development",
        },
        {
          id: "4",
          name: "TA John",
          email: "john@example.com",
          role: "Teaching Assistant",
          github: "johnTA",
          linkedin: "",
          phone: "",
          location: "",
          bio: "",
          cohort: "2024-A",
          startDate: "",
          studentId: "",
          pictureUrl: "",
        },
      ],
      // Friend requests state
      friendRequests: [],
      sendFriendRequest: (fromId, toId) => {
        const existing = get().friendRequests.find(
          (r) =>
            r.fromId === fromId && r.toId === toId && r.status === "pending"
        );
        if (existing) return; // Already pending
        const newRequest = {
          id: Date.now(),
          fromId,
          toId,
          status: "pending",
          timestamp: new Date().toISOString(),
        };
        set((state) => ({
          friendRequests: [...state.friendRequests, newRequest],
        }));
        // Add notification to receiver
        const newNotif = {
          id: Date.now() + 1,
          userId: toId,
          type: "friend_request_received",
          fromUserId: fromId,
          requestId: newRequest.id,
          message: `You have a new friend request from ${get().directory.find(u => u.id === fromId)?.name || fromId}.`,
          read: false,
          timestamp: new Date().toISOString(),
        };
        get().addNotification(newNotif);
        get().playNotificationSound();
      },
      acceptFriendRequest: (requestId) => {
        const state = get();
        const request = state.friendRequests.find((r) => r.id === requestId);
        if (!request) return;
        const fromUser = state.directory.find((u) => u.id === request.fromId);
        const toUser = state.directory.find((u) => u.id === request.toId);
        set((state) => ({
          friendRequests: state.friendRequests.map((r) =>
            r.id === requestId ? { ...r, status: "accepted" } : r
          ),
        }));
        // Notify the sender (fromUser)
        const newNotif = {
          id: Date.now(),
          userId: request.fromId,
          type: "friend_request_accepted",
          fromUserId: request.toId,
          requestId,
          message: `Your friend request to ${
            toUser?.name || "a user"
          } has been accepted!`,
          read: false,
          timestamp: new Date().toISOString(),
        };
        get().addNotification(newNotif);
      },
      rejectFriendRequest: (requestId) => {
        const state = get();
        const request = state.friendRequests.find((r) => r.id === requestId);
        if (!request) return;
        const fromUser = state.directory.find((u) => u.id === request.fromId);
        const toUser = state.directory.find((u) => u.id === request.toId);
        set((state) => ({
          friendRequests: state.friendRequests.map((r) =>
            r.id === requestId ? { ...r, status: "rejected" } : r
          ),
        }));
        // Notify the sender (fromUser)
        const newNotif = {
          id: Date.now(),
          userId: request.fromId,
          type: "friend_request_rejected",
          fromUserId: request.toId,
          requestId,
          message: `Your friend request to ${
            toUser?.name || "a user"
          } has been rejected.`,
          read: false,
          timestamp: new Date().toISOString(),
        };
        get().addNotification(newNotif);
      },
      // Conversations state - Updated to handle string IDs
      conversations: {},
      addMessage: (
        user1Id,
        user2Id,
        senderId,
        text,
        timestamp = new Date().toISOString(),
        messageId = Date.now().toString()
      ) => {
        // Updated to handle string IDs safely
        const id1 = user1Id.toString();
        const id2 = user2Id.toString();
        const key = [Math.min(id1, id2), Math.max(id1, id2)].join("-");
        const message = {
          id: messageId,
          senderId: senderId.toString(),
          text,
          timestamp,
        };
        set((state) => ({
          conversations: {
            ...state.conversations,
            [key]: [...(state.conversations[key] || []), message],
          },
        }));
        // Add notification to recipient
        const recipientId = id1 === senderId.toString() ? id2 : id1;
        if (recipientId !== senderId.toString()) {
          const newNotif = {
            id: Date.now() + 1,
            userId: recipientId,
            type: "message",
            fromUserId: senderId.toString(),
            messageId: messageId,
            read: false,
            timestamp: new Date().toISOString(),
          };
          get().addNotification(newNotif);
          get().playNotificationSound();
        }
      },
      // Notifications state
      notifications: [],
      addNotification: (notification) =>
        set((state) => ({
          notifications: [...state.notifications, notification],
        })),
      markNotificationAsRead: (notificationId) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === notificationId ? { ...n, read: true } : n
          ),
        })),
      markAsRead: (userId) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.userId === userId ? { ...n, read: true } : n
          ),
        })),
      // Sound alert for notifications
      playNotificationSound: () => {
        try {
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          oscillator.frequency.value = 800; // A4 note
          oscillator.type = 'sine';
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.2);
        } catch (e) {
          console.log('Sound play failed:', e);
        }
      },
      // State for Announcements
      announcements: [],
      addAnnouncement: (announcement) => {
        console.log("Store: Adding announcement", announcement);
        set((state) => {
          const newAnnouncements = [announcement, ...state.announcements];
          console.log("Store: New announcements array:", newAnnouncements);
          // Notify all students
          const students = state.directory.filter((u) => u.role === "Student");
          const newNotifs = students.map((student, index) => ({
            id: Date.now() + index,
            userId: student.id,
            type: "new_announcement",
            announcementId: announcement.id,
            message: `New announcement: ${announcement.title}`,
            read: false,
            timestamp: new Date().toISOString(),
          }));
          return {
            announcements: newAnnouncements,
            notifications: [...state.notifications, ...newNotifs],
          };
        });
      },
      updateAnnouncement: (id, updatedAnnouncement) =>
        set((state) => ({
          announcements: state.announcements.map((a) =>
            a.id === id ? { ...a, ...updatedAnnouncement } : a
          ),
        })),
      deleteAnnouncement: (id) =>
        set((state) => ({
          announcements: state.announcements.filter((a) => a.id !== id),
        })),
      // State for Assignments
      assignments: [],
      addAssignment: (assignment) =>
        set((state) => {
          const newNotif = {
            id: Date.now(),
            userId: assignment.studentId,
            type: "new_assignment",
            assignmentId: assignment.id,
            message: `New assignment: ${assignment.title} due ${assignment.dueDate}`,
            read: false,
            timestamp: new Date().toISOString(),
          };
          return {
            assignments: [assignment, ...state.assignments],
            notifications: [...state.notifications, newNotif],
          };
        }),
      updateAssignment: (id, updatedAssignment) =>
        set((state) => ({
          assignments: state.assignments.map((a) =>
            a.id === id ? { ...a, ...updatedAssignment } : a
          ),
        })),
      deleteAssignment: (id) =>
        set((state) => ({
          assignments: state.assignments.filter((a) => a.id !== id),
        })),
      // State for Events
      events: [],
      addEvent: (event) =>
        set((state) => ({
          events: [event, ...state.events],
        })),
      updateEvent: (id, updatedEvent) =>
        set((state) => ({
          events: state.events.map((e) =>
            e.id === id ? { ...e, ...updatedEvent } : e
          ),
        })),
      deleteEvent: (id) =>
        set((state) => ({
          events: state.events.filter((e) => e.id !== id),
        })),
      // State for WorkReady Resources
      workReadyResources: [],
      addWorkReadyResource: (resource) =>
        set((state) => {
          const students = state.directory.filter((u) => u.role === "Student");
          const newNotifs = students.map((student, index) => ({
            id: Date.now() + index,
            userId: student.id,
            type: "new_workready_resource",
            resourceId: resource.id,
            message: `New WorkReady resource: ${
              resource.title || resource.name || "New Resource"
            }`,
            read: false,
            timestamp: new Date().toISOString(),
          }));
          return {
            workReadyResources: [resource, ...state.workReadyResources],
            notifications: [...state.notifications, ...newNotifs],
          };
        }),
      // State for Roadmap Items
      roadmapItems: [],
      addRoadmapItem: (item) => {
        console.log("🔷 Store: Adding roadmap item", item);
        set((state) => {
          const newItems = [item, ...state.roadmapItems];
          console.log("🔷 Store: New roadmapItems array:", newItems);
          // Notify all students
          const students = state.directory.filter((u) => u.role === "Student");
          const newNotifs = students.map((student, index) => ({
            id: Date.now() + index,
            userId: student.id,
            type: "new_roadmap",
            roadmapId: item.id,
            message: `New roadmap item added: ${item.phase} - ${item.term}`,
            read: false,
            timestamp: new Date().toISOString(),
          }));
          return {
            roadmapItems: newItems,
            notifications: [...state.notifications, ...newNotifs],
          };
        });
      },
      updateRoadmapItem: (id, updates) => {
        console.log("🔷 Store: Updating roadmap item", { id, updates });
        set((state) => ({
          roadmapItems: state.roadmapItems.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        }));
      },
      deleteRoadmapItem: (id) =>
        set((state) => ({
          roadmapItems: state.roadmapItems.filter((item) => item.id !== id),
        })),
      // Add a week to a roadmap
      addWeekToRoadmap: (roadmapId, weekNumber, topic) => {
        console.log("🔶 Store: Adding week", { roadmapId, weekNumber, topic });
        set((state) => {
          const newRoadmapItems = state.roadmapItems.map((item) => {
            if (item.id === roadmapId) {
              const newWeek = {
                weekNumber: weekNumber,
                week: weekNumber,
                topic: topic,
                current: false,
                next: false,
                passed: false,
                subTopics: [],
              };
              const newWeeks = [...(item.weeks || []), newWeek];
              return { ...item, weeks: newWeeks };
            }
            return item;
          });
          // Notify all students
          const students = state.directory.filter((u) => u.role === "Student");
          const newNotifs = students.map((student, index) => ({
            id: Date.now() + index,
            userId: student.id,
            type: "new_week",
            roadmapId,
            weekNumber,
            message: `New week added to roadmap: Week ${weekNumber} - ${topic}`,
            read: false,
            timestamp: new Date().toISOString(),
          }));
          return {
            roadmapItems: newRoadmapItems,
            notifications: [...state.notifications, ...newNotifs],
          };
        });
      },
      // Add a subtopic to a specific week
      addSubTopicToWeek: (roadmapId, weekIndex, subTopicName) => {
        console.log("🟢 Store: Adding subtopic START", {
          roadmapId,
          weekIndex,
          subTopicName,
        });
        set((state) => {
          const newRoadmapItems = state.roadmapItems.map((item) => {
            if (item.id === roadmapId) {
              const newWeeks = JSON.parse(JSON.stringify(item.weeks || []));
              if (weekIndex >= 0 && weekIndex < newWeeks.length) {
                const targetWeek = newWeeks[weekIndex];
                if (!targetWeek.subTopics) {
                  targetWeek.subTopics = [];
                }
                const maxId =
                  targetWeek.subTopics.length > 0
                    ? Math.max(...targetWeek.subTopics.map((st) => st.id))
                    : 0;
                const newSubTopic = {
                  id: maxId + 1,
                  name: subTopicName,
                  completed: false,
                };
                targetWeek.subTopics.push(newSubTopic);
              }
              return { ...item, weeks: newWeeks };
            }
            return item;
          });
          // Notify all students
          const students = state.directory.filter((u) => u.role === "Student");
          const newNotifs = students.map((student, index) => ({
            id: Date.now() + index,
            userId: student.id,
            type: "new_subtopic",
            roadmapId,
            weekIndex,
            subTopicName,
            message: `New subtopic added: ${subTopicName}`,
            read: false,
            timestamp: new Date().toISOString(),
          }));
          return {
            roadmapItems: newRoadmapItems,
            notifications: [...state.notifications, ...newNotifs],
          };
        });
      },
      // Toggle subtopic completion
      toggleSubTopicComplete: (roadmapId, weekIndex, subTopicId) =>
        set((state) => ({
          roadmapItems: state.roadmapItems.map((item) => {
            if (item.id === roadmapId) {
              const newWeeks = [...item.weeks];
              const week = newWeeks[weekIndex];
              if (week) {
                week.subTopics = week.subTopics.map((st) =>
                  st.id === subTopicId
                    ? { ...st, completed: !st.completed }
                    : st
                );
              }
              return { ...item, weeks: newWeeks };
            }
            return item;
          }),
        })),
      // Delete a subtopic
      deleteSubTopic: (roadmapId, weekIndex, subTopicId) =>
        set((state) => ({
          roadmapItems: state.roadmapItems.map((item) => {
            if (item.id === roadmapId) {
              const newWeeks = [...item.weeks];
              if (newWeeks[weekIndex]) {
                newWeeks[weekIndex].subTopics = newWeeks[
                  weekIndex
                ].subTopics.filter((st) => st.id !== subTopicId);
              }
              return { ...item, weeks: newWeeks };
            }
            return item;
          }),
        })),
      // Set current week
      setCurrentWeek: (roadmapId, weekIndex) =>
        set((state) => {
          const newRoadmapItems = state.roadmapItems.map((item) => {
            if (item.id === roadmapId) {
              const newWeeks = item.weeks.map((w, idx) => ({
                ...w,
                current: idx === weekIndex,
                next: idx === weekIndex + 1,
              }));
              return { ...item, weeks: newWeeks };
            }
            return item;
          });
          let newNotifications = state.notifications;
          if (weekIndex != null) {
            const roadmapItem = state.roadmapItems.find(
              (item) => item.id === roadmapId
            );
            const week = roadmapItem?.weeks?.[weekIndex];
            if (week) {
              const students = state.directory.filter(
                (u) => u.role === "Student"
              );
              const newNotifs = students.map((student, index) => ({
                id: Date.now() + index,
                userId: student.id,
                type: "new_roadmap",
                roadmapId,
                weekIndex,
                message: `Current week updated: Week ${week.weekNumber} - ${week.topic}`,
                read: false,
                timestamp: new Date().toISOString(),
              }));
              newNotifications = [...newNotifications, ...newNotifs];
            }
          }
          return {
            roadmapItems: newRoadmapItems,
            notifications: newNotifications,
          };
        }),
      // Mark week as passed (clears current/next and sets passed flag)
      markWeekPassed: (roadmapId, weekIndex) =>
        set((state) => {
          const newRoadmapItems = state.roadmapItems.map((item) => {
            if (item.id === roadmapId) {
              return {
                ...item,
                weeks: item.weeks.map((w, idx) => ({
                  ...w,
                  current: idx === weekIndex ? false : w.current,
                  next: idx === weekIndex ? false : w.next,
                  passed: idx === weekIndex ? true : w.passed,
                })),
              };
            }
            return item;
          });
          // Notify all students
          const roadmapItem = state.roadmapItems.find(
            (item) => item.id === roadmapId
          );
          const week = roadmapItem?.weeks?.[weekIndex];
          let newNotifications = state.notifications;
          if (week) {
            const students = state.directory.filter(
              (u) => u.role === "Student"
            );
            const newNotifs = students.map((student, index) => ({
              id: Date.now() + index,
              userId: student.id,
              type: "new_roadmap",
              roadmapId,
              weekIndex,
              message: `Week ${week.weekNumber} marked as passed: ${week.topic}`,
              read: false,
              timestamp: new Date().toISOString(),
            }));
            newNotifications = [...newNotifications, ...newNotifs];
          }
          return {
            roadmapItems: newRoadmapItems,
            notifications: newNotifications,
          };
        }),
      // State for Resource Library
      resources: [],
      addResource: (resource) =>
        set((state) => ({
          resources: [resource, ...state.resources],
        })),
      // State for Projects
      projects: [],
      addProject: (project) =>
        set((state) => {
          const newNotif = {
            id: Date.now(),
            userId: project.studentId,
            type: "new_project",
            projectId: project.id,
            message: `New project: ${project.title} due ${project.dueDate}`,
            read: false,
            timestamp: new Date().toISOString(),
          };
          return {
            projects: [project, ...state.projects],
            notifications: [...state.notifications, newNotif],
          };
        }),
      updateProject: (id, updatedProject) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...updatedProject } : p
          ),
        })),
      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        })),
      // State for Profile Updates - Deprecated in favor of directory; kept for backward compatibility but not used
      profile: {
        name: "Julius Dagana",
        email: "julius@example.com",
        phone: "+233 24 123 4567",
        location: "Accra, Ghana",
        github: "juliusdagana",
        linkedin: "juliusdagana",
        bio: "Full-stack developer in training with a passion for building web applications.",
        cohort: "Cohort 2024-B",
        startDate: "August 2024",
        studentId: "",
        adminUid: null, // NEW: For dynamic admin UID
        pictureUrl: "https://via.placeholder.com/150x150/4F46E5/FFFFFF?text=JD", // NEW: For profile picture
      },
      updateProfile: (updatedProfile) =>
        set((state) => ({
          profile: { ...state.profile, ...updatedProfile },
        })),
      // State for Grading
      grades: [],
      addGrade: (grade) =>
        set((state) => ({
          grades: [grade, ...state.grades],
        })),
      // State for Exercises
      exercises: [],
      addExercise: (exercise) =>
        set((state) => {
          const newNotif = {
            id: Date.now(),
            userId: exercise.studentId,
            type: "new_exercise",
            exerciseId: exercise.id,
            message: `New exercise: ${exercise.title} due ${exercise.dueDate}`,
            read: false,
            timestamp: new Date().toISOString(),
          };
          return {
            exercises: [exercise, ...state.exercises],
            notifications: [...state.notifications, newNotif],
          };
        }),
      updateExercise: (id, updatedExercise) =>
        set((state) => ({
          exercises: state.exercises.map((e) =>
            e.id === id ? { ...e, ...updatedExercise } : e
          ),
        })),
      deleteExercise: (id) =>
        set((state) => ({
          exercises: state.exercises.filter((e) => e.id !== id),
        })),
      // State for Directory
      addDirectoryEntry: (entry) =>
        set((state) => ({
          directory: [entry, ...state.directory],
        })),
      // NEW: Update user in directory
      updateUser: (id, updates) =>
        set((state) => ({
          directory: state.directory.map((u) =>
            u.id === id ? { ...u, ...updates } : u
          ),
        })),
      // State for Days of Learning - Updated with auto-progress fields
      daysOfLearning: {
        completedDays: 0,
        totalDays: 100,
        activities: [],
        isActive: false,
        lastCompletedDate: null,
      },
      updateDaysOfLearning: (data) =>
        set((state) => {
          const oldCompleted = state.daysOfLearning.completedDays;
          const newDol = { ...state.daysOfLearning, ...data };
          const newCompleted = newDol.completedDays;
          let newNotifs = state.notifications;
          if (newCompleted > oldCompleted) {
            newNotifs = [
              ...newNotifs,
              {
                id: Date.now(),
                userId: "1", // Updated to string
                type: "day_completed",
                day: newCompleted,
                message: `Day ${newCompleted} completed! Keep going!`,
                read: false,
                timestamp: new Date().toISOString(),
              },
            ];
          }
          return {
            daysOfLearning: newDol,
            notifications: newNotifs,
          };
        }),
      // State for Class Materials
      classMaterials: [],
      addClassMaterial: (material) =>
        set((state) => {
          const students = state.directory.filter((u) => u.role === "Student");
          const newNotifs = students.map((student, index) => ({
            id: Date.now() + index,
            userId: student.id,
            type: "new_class_material",
            materialId: material.id,
            message: `New class material: ${material.title} for week ${material.week}`,
            read: false,
            timestamp: new Date().toISOString(),
          }));
          return {
            classMaterials: [material, ...state.classMaterials],
            notifications: [...state.notifications, ...newNotifs],
          };
        }),
      updateClassMaterial: (id, updatedMaterial) =>
        set((state) => ({
          classMaterials: state.classMaterials.map((m) =>
            m.id === id ? { ...m, ...updatedMaterial } : m
          ),
        })),
      deleteClassMaterial: (id) =>
        set((state) => ({
          classMaterials: state.classMaterials.filter((m) => m.id !== id),
        })),
      // State for Campus Connect Posts
      posts: [],
      addPost: (post) =>
        set((state) => ({
          posts: [post, ...state.posts],
        })),
      // State for Booked Sessions (updated)
      sessions: [],
      addSession: (session) => {
        set((state) => {
          const newSessions = [session, ...state.sessions];
          let newNotifications = state.notifications;
          if (session.status === "pending") {
            const newNotif = {
              id: Date.now(),
              userId: "2", // Updated to string
              type: "session_booked",
              fromUserId: session.studentId,
              sessionId: session.id,
              message: `New session request: "${session.title}" on ${session.date} at ${session.time}`,
              read: false,
              timestamp: new Date().toISOString(),
            };
            newNotifications = [...newNotifications, newNotif];
          }
          return {
            sessions: newSessions,
            notifications: newNotifications,
          };
        });
        get().playNotificationSound();
      },
      approveSession: (sessionId, zoomLink) => {
        set((state) => {
          const session = state.sessions.find((s) => s.id === sessionId);
          if (!session) return state;
          const finalZoomLink = zoomLink || "";
          const newNotif = {
            id: Date.now(),
            userId: session.studentId,
            type: "session_approved",
            fromUserId: "2", // Updated to string
            sessionId,
            message: `Your session "${session.title}" has been approved. Zoom link ready.`,
            read: false,
            timestamp: new Date().toISOString(),
          };
          return {
            sessions: state.sessions.map((s) =>
              s.id === sessionId
                ? { ...s, status: "approved", zoomLink: finalZoomLink }
                : s
            ),
            notifications: [...state.notifications, newNotif],
          };
        });
        get().playNotificationSound();
      },
      rejectSession: (sessionId) => {
        set((state) => {
          const session = state.sessions.find((s) => s.id === sessionId);
          if (!session) return state;
          const newNotif = {
            id: Date.now(),
            userId: session.studentId,
            type: "session_rejected",
            fromUserId: "2", // Updated to string
            sessionId,
            message: `Your session "${session.title}" has been rejected.`,
            read: false,
            timestamp: new Date().toISOString(),
          };
          return {
            sessions: state.sessions.map((s) =>
              s.id === sessionId ? { ...s, status: "rejected" } : s
            ),
            notifications: [...state.notifications, newNotif],
          };
        });
        get().playNotificationSound();
      },
      startSession: (sessionId) => {
        set((state) => {
          const session = state.sessions.find((s) => s.id === sessionId);
          if (!session || session.status !== "approved") return state;
          const finalZoomLink =
            session.zoomLink || `https://zoom.us/j/${Date.now()}-${sessionId}`;
          const newNotif = {
            id: Date.now(),
            userId: session.studentId,
            type: "session_started",
            fromUserId: "2", // Updated to string
            sessionId,
            message: `Your session "${session.title}" has started! Join now.`,
            read: false,
            timestamp: new Date().toISOString(),
          };
          return {
            sessions: state.sessions.map((s) =>
              s.id === sessionId
                ? { ...s, status: "started", zoomLink: finalZoomLink }
                : s
            ),
            notifications: [...state.notifications, newNotif],
          };
        });
        get().playNotificationSound();
      },
      updateSession: (sessionId, updates) =>
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === sessionId ? { ...s, ...updates } : s
          ),
        })),
      deleteSession: (sessionId) =>
        set((state) => ({
          sessions: state.sessions.filter((s) => s.id !== sessionId),
        })),
      // State for Attendance
      attendance: [],
      addAttendance: (attendance) =>
        set((state) => {
          const newNotif = {
            id: Date.now(),
            userId: attendance.studentId,
            type: "new_attendance",
            attendanceId: attendance.id,
            message: `Attendance for ${attendance.date}: ${attendance.status} - Topic: ${attendance.topic}`,
            read: false,
            timestamp: new Date().toISOString(),
          };
          return {
            attendance: [attendance, ...state.attendance],
            notifications: [...state.notifications, newNotif],
          };
        }),
      updateAttendance: (id, updatedAttendance) =>
        set((state) => ({
          attendance: state.attendance.map((a) =>
            a.id === id ? { ...a, ...updatedAttendance } : a
          ),
        })),
      deleteAttendance: (id) =>
        set((state) => ({
          attendance: state.attendance.filter((a) => a.id !== id),
        })),
      // State for Programs
      programs: [],
      addProgram: (program) =>
        set((state) => {
          const students = state.directory.filter((u) => u.role === "Student");
          const newNotifs = students.map((student, index) => ({
            id: Date.now() + index,
            userId: student.id,
            type: "new_program",
            programId: program.id,
            message: `New program available: ${program.name}`,
            read: false,
            timestamp: new Date().toISOString(),
          }));
          return {
            programs: [program, ...state.programs],
            notifications: [...state.notifications, ...newNotifs],
          };
        }),
      updateProgram: (id, updatedProgram) =>
        set((state) => ({
          programs: state.programs.map((p) =>
            p.id === id ? { ...p, ...updatedProgram } : p
          ),
        })),
      deleteProgram: (id) =>
        set((state) => ({
          programs: state.programs.filter((p) => p.id !== id),
        })),
      addMilestoneToProgram: (programId, milestoneName) => {
        set((state) => {
          const newPrograms = state.programs.map((p) => {
            if (p.id === programId) {
              const newMilestones = [...(p.milestones || [])];
              const maxId =
                newMilestones.length > 0
                  ? Math.max(...newMilestones.map((m) => m.id))
                  : 0;
              newMilestones.push({
                id: maxId + 1,
                name: milestoneName,
                completed: false,
              });
              return { ...p, milestones: newMilestones };
            }
            return p;
          });
          // Notify enrolled students
          const program = state.programs.find((p) => p.id === programId);
          let newNotifs = state.notifications;
          if (program) {
            const enrolled = program.enrolledStudents || [];
            const milestoneNotifs = enrolled.map((studentId, index) => ({
              id: Date.now() + index,
              userId: studentId,
              type: "new_milestone",
              programId,
              milestoneName,
              message: `New milestone added to ${program.name}: ${milestoneName}`,
              read: false,
              timestamp: new Date().toISOString(),
            }));
            newNotifs = [...newNotifs, ...milestoneNotifs];
          }
          return {
            programs: newPrograms,
            notifications: newNotifs,
          };
        });
      },
      adminToggleMilestoneComplete: (programId, milestoneId) =>
        set((state) => {
          const newPrograms = state.programs.map((p) => {
            if (p.id === programId) {
              return {
                ...p,
                milestones:
                  p.milestones?.map((m) =>
                    m.id === milestoneId ? { ...m, completed: !m.completed } : m
                  ) || [],
              };
            }
            return p;
          });
          // Notify enrolled students
          const program = state.programs.find((p) => p.id === programId);
          let newNotifs = state.notifications;
          if (program) {
            const milestone = program.milestones?.find(
              (m) => m.id === milestoneId
            );
            if (milestone) {
              const newStatus = !milestone.completed;
              const enrolled = program.enrolledStudents || [];
              const statusNotifs = enrolled.map((studentId, index) => ({
                id: Date.now() + index,
                userId: studentId,
                type: "milestone_updated",
                programId,
                milestoneId,
                message: `${program.name} milestone "${milestone.name}" ${
                  newStatus ? "completed" : "uncompleted"
                }`,
                read: false,
                timestamp: new Date().toISOString(),
              }));
              newNotifs = [...newNotifs, ...statusNotifs];
            }
          }
          return {
            programs: newPrograms,
            notifications: newNotifs,
          };
        }),
      requestJoinProgram: (
        programId,
        studentId = "1" // Updated default to string
      ) => {
        set((state) => {
          const program = state.programs.find((p) => p.id === programId);
          if (!program) return state;
          const newNotif = {
            id: Date.now(),
            userId: "2", // Updated to string
            type: "program_join_requested",
            fromUserId: studentId,
            programId,
            message: `New join request for "${program.name}" from student.`,
            read: false,
            timestamp: new Date().toISOString(),
          };
          return {
            programs: state.programs.map((p) => {
              if (
                p.id === programId &&
                !p.pendingRequests?.includes(studentId) &&
                !p.enrolledStudents?.includes(studentId)
              ) {
                return {
                  ...p,
                  pendingRequests: [...(p.pendingRequests || []), studentId],
                };
              }
              return p;
            }),
            notifications: [...state.notifications, newNotif],
          };
        });
        get().playNotificationSound();
      },
      approveJoinRequest: (
        programId,
        studentId = "1" // Updated default
      ) => {
        set((state) => {
          const program = state.programs.find((p) => p.id === programId);
          if (!program) return state;
          const newNotif = {
            id: Date.now(),
            userId: studentId,
            type: "program_join_approved",
            fromUserId: "2", // Updated
            programId,
            message: `Your request to join "${program.name}" has been approved!`,
            read: false,
            timestamp: new Date().toISOString(),
          };
          return {
            programs: state.programs.map((p) => {
              if (p.id === programId) {
                const pending =
                  p.pendingRequests?.filter((id) => id !== studentId) || [];
                const enrolled = [...(p.enrolledStudents || []), studentId];
                return {
                  ...p,
                  pendingRequests: pending,
                  enrolledStudents: enrolled,
                };
              }
              return p;
            }),
            notifications: [...state.notifications, newNotif],
          };
        });
        get().playNotificationSound();
      },
      rejectJoinRequest: (
        programId,
        studentId = "1" // Updated default
      ) => {
        set((state) => {
          const program = state.programs.find((p) => p.id === programId);
          if (!program) return state;
          const newNotif = {
            id: Date.now(),
            userId: studentId,
            type: "program_join_rejected",
            fromUserId: "2", // Updated
            programId,
            message: `Your request to join "${program.name}" has been rejected.`,
            read: false,
            timestamp: new Date().toISOString(),
          };
          return {
            programs: state.programs.map((p) => {
              if (p.id === programId) {
                const pending =
                  p.pendingRequests?.filter((id) => id !== studentId) || [];
                return {
                  ...p,
                  pendingRequests: pending,
                };
              }
              return p;
            }),
            notifications: [...state.notifications, newNotif],
          };
        });
        get().playNotificationSound();
      },
    }),
    {
      name: "manage-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
export default useManageStore;



<!--Note this code is for pull in-case of any challenge in the future /No firebase work /Hardcoded uid(user) and Admi  -->