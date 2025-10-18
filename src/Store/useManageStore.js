import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
const useManageStore = create(
  persist(
    (set, get) => ({
      // Initial directory data - IDs as numbers for consistency, added missing fields like phone, location, bio, startDate, studentId for completeness
      directory: [
        {
          id: 1,
          name: "Julius Dagana",
          email: "julius@example.com",
          phone: "+233 24 123 4567",
          location: "Accra, Ghana",
          role: "Student",
          github: "juliusdagana",
          linkedin: "juliusdagana",
          cohort: "2024-B",
          studentId: "S001", // Added for profile completeness
          bio: "Full-stack developer in training with a passion for building web applications.",
          startDate: "August 2024", // Added for profile completeness
          pictureUrl:
            "https://via.placeholder.com/150x150/4F46E5/FFFFFF?text=JD",
        },
        {
          id: 2,
          name: "Admin",
          email: "admin@gradea.com",
          role: "Administrator",
          github: "admin",
          cohort: "Staff",
          pictureUrl: "",
        },
        {
          id: 3,
          name: "Instructor Smith",
          email: "smith@example.com",
          role: "Instructor",
          github: "smith",
          specialty: "Web Development",
          pictureUrl: "",
        },
        {
          id: 4,
          name: "TA John",
          email: "john@example.com",
          role: "Teaching Assistant",
          github: "johnTA",
          cohort: "2024-A",
          pictureUrl: "",
        },
      ],
      // Friend requests state
      friendRequests: [],
      sendFriendRequest: (fromId, toId) => {
        const state = get();
        const existing = state.friendRequests.find(
          (r) =>
            r.fromId === fromId && r.toId === toId && r.status === "pending"
        );
        if (existing) return; // Already pending
        const fromUser = state.directory.find((u) => u.id === fromId);
        const toUser = state.directory.find((u) => u.id === toId);
        const newRequest = {
          id: Date.now().toString(),
          fromId,
          toId,
          status: "pending",
          timestamp: new Date().toISOString(),
        };
        set((state) => ({
          friendRequests: [...state.friendRequests, newRequest],
        }));
        // FIXED: Notify the recipient (toId)
        const newNotifToRecipient = {
          id: Date.now() + 1,
          userId: toId,
          type: "friend_request_received",
          fromUserId: fromId,
          requestId: newRequest.id,
          message: `New friend request from ${fromUser?.name || "a user"}`,
          read: false,
          timestamp: new Date().toISOString(),
        };
        get().addNotification(newNotifToRecipient);
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
      // Conversations state
      conversations: {},
      addMessage: (
        user1Id,
        user2Id,
        senderId,
        text,
        timestamp = new Date().toISOString(),
        messageId = Date.now().toString()
      ) => {
        const id1 = user1Id;
        const id2 = user2Id;
        const key = [Math.min(id1, id2), Math.max(id1, id2)].join("-");
        const message = {
          id: messageId,
          senderId,
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
        const recipientId = id1 === senderId ? id2 : id1;
        if (recipientId !== senderId) {
          const newNotif = {
            id: Date.now() + 1,
            userId: recipientId,
            type: "message",
            fromUserId: senderId,
            messageId: messageId,
            read: false,
            timestamp: new Date().toISOString(),
          };
          get().addNotification(newNotif);
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
      // State for Profile Updates - Added adminUid field and pictureUrl
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
        studentId: 1,
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
                userId: 1,
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
      addSession: (session) =>
        set((state) => {
          const newSessions = [session, ...state.sessions];
          let newNotifications = state.notifications;
          if (session.status === "pending") {
            const newNotif = {
              id: Date.now(),
              userId: 2,
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
        }),
      approveSession: (sessionId, zoomLink) =>
        set((state) => {
          const session = state.sessions.find((s) => s.id === sessionId);
          if (!session) return state;
          const finalZoomLink = zoomLink || "";
          const newNotif = {
            id: Date.now(),
            userId: session.studentId,
            type: "session_approved",
            fromUserId: 2,
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
        }),
      rejectSession: (sessionId) =>
        set((state) => {
          const session = state.sessions.find((s) => s.id === sessionId);
          if (!session) return state;
          const newNotif = {
            id: Date.now(),
            userId: session.studentId,
            type: "session_rejected",
            fromUserId: 2,
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
        }),
      startSession: (sessionId) =>
        set((state) => {
          const session = state.sessions.find((s) => s.id === sessionId);
          if (!session || session.status !== "approved") return state;
          const finalZoomLink =
            session.zoomLink || `https://zoom.us/j/${Date.now()}-${sessionId}`;
          const newNotif = {
            id: Date.now(),
            userId: session.studentId,
            type: "session_started",
            fromUserId: 2,
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
        }),
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
      requestJoinProgram: (programId, studentId = 1) =>
        set((state) => {
          const program = state.programs.find((p) => p.id === programId);
          if (!program) return state;
          const newNotif = {
            id: Date.now(),
            userId: 2,
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
        }),
      approveJoinRequest: (programId, studentId = 1) =>
        set((state) => {
          const program = state.programs.find((p) => p.id === programId);
          if (!program) return state;
          const newNotif = {
            id: Date.now(),
            userId: studentId,
            type: "program_join_approved",
            fromUserId: 2,
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
        }),
      rejectJoinRequest: (programId, studentId = 1) =>
        set((state) => {
          const program = state.programs.find((p) => p.id === programId);
          if (!program) return state;
          const newNotif = {
            id: Date.now(),
            userId: studentId,
            type: "program_join_rejected",
            fromUserId: 2,
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
        }),
    }),
    {
      name: "manage-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
export default useManageStore;
