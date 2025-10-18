// Updated FirebaseConfig.js - Fixed timestamp handling for Firestore Timestamps
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  query,
  where,
  limit,
  getDocs,
  collection,
  addDoc,
  updateDoc,
  arrayUnion,
  getDoc,
  serverTimestamp,
  onSnapshot,
  getCountFromServer,
} from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAsINOQJO-JZBxLfOTZebbIX-b8AAvLMx0",
  authDomain: "gradea-16e92.firebaseapp.com",
  projectId: "gradea-16e92",
  storageBucket: "gradea-16e92.firebasestorage.app",
  messagingSenderId: "997063193649",
  appId: "1:997063193649:web:3cd18734390b80982d1110",
  measurementId: "G-PJSBKFP1Y9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Admin Signup (Unique Admin ID - Chosen by Admin)
async function adminSignup(email, password, adminId) {
  try {
    // Check if adminId is unique - Added .limit(1) to satisfy rules
    const adminsQuery = query(
      collection(db, "admins"),
      where("adminId", "==", adminId),
      limit(1) // Now properly imported
    );
    const querySnapshot = await getDocs(adminsQuery);
    if (!querySnapshot.empty) {
      throw new Error("Admin ID already exists. Please choose a unique ID.");
    }
    // Create user with Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    // Store admin data in Firestore
    await setDoc(doc(db, "admins", user.uid), {
      email: email,
      adminId: adminId,
      teamStudents: [], // Array of student UIDs for easy reference
    });
    console.log("Admin created successfully");
    return user;
  } catch (error) {
    console.error("Error creating admin:", error);
    throw error;
  }
}

// Student Signup (Assignment to Admin Team)
async function studentSignup(email, password, adminId) {
  try {
    // Find admin by adminId - Added .limit(1) to satisfy rules
    const adminsQuery = query(
      collection(db, "admins"),
      where("adminId", "==", adminId),
      limit(1) // Now properly imported
    );
    const querySnapshot = await getDocs(adminsQuery);
    if (querySnapshot.empty) {
      throw new Error("No admin found with this ID. Signup denied.");
    }
    const adminDoc = querySnapshot.docs[0];
    const adminUid = adminDoc.id;
    // Create student user with Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const studentUid = userCredential.user.uid;
    // Add student to admin's team subcollection
    await addDoc(collection(db, "admins", adminUid, "students"), {
      uid: studentUid,
      email: email,
      joinedAt: new Date(),
    });
    // Store student data in top-level students collection with adminUid for easy reference
    await setDoc(doc(db, "students", studentUid), {
      email: email,
      adminUid: adminUid,
      joinedAt: new Date(),
    });
    // Removed updateDoc here - It caused permission denial (student can't update admin doc)
    // Use subcollection for team management/counts instead (already implemented in getStudentCount)
    console.log("Student assigned to admin team successfully");
    return userCredential.user;
  } catch (error) {
    console.error("Error creating student:", error);
    throw error;
  }
}

// Login function
async function login(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
}

// Get User Profile from Firestore (unified for admins/students in 'users' collection)
async function getUserProfile(uid) {
  try {
    // First, check if a profile exists in the unified 'users' collection
    const userDocRef = doc(db, "users", uid);
    const userDocSnap = await getDoc(userDocRef);
    if (userDocSnap.exists()) {
      const profile = userDocSnap.data();
      // Map joinedAt to startDate if present
      if (profile.joinedAt) {
        profile.startDate = profile.joinedAt.toDate().toLocaleDateString();
      }
      return profile;
    }
    // Fallback: Check admin or student specific collections
    // For admins
    const adminDocRef = doc(db, "admins", uid);
    const adminDocSnap = await getDoc(adminDocRef);
    if (adminDocSnap.exists()) {
      const data = adminDocSnap.data();
      return {
        email: data.email,
        name: "", // Admins may not have name; can be added later
        phone: "",
        location: "",
        github: "",
        linkedin: "",
        bio: "",
        cohort: "Admin", // Or fetch from elsewhere
        startDate: new Date().toLocaleDateString(),
        studentId: "",
      };
    }
    // For students
    const studentDocRef = doc(db, "students", uid);
    const studentDocSnap = await getDoc(studentDocRef);
    if (studentDocSnap.exists()) {
      const data = studentDocSnap.data();
      return {
        email: data.email,
        name: "", // Name not set yet; can be updated via profile
        phone: "",
        location: "",
        github: "",
        linkedin: "",
        bio: "",
        cohort: "2024-B", // Default; can be customized
        startDate: data.joinedAt
          ? data.joinedAt.toDate().toLocaleDateString()
          : new Date().toLocaleDateString(),
        studentId: "",
      };
    }
    // If no profile found anywhere, return null or defaults
    return null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
}

// Save User Profile to Firestore (unified in 'users' collection)
async function saveUserProfile(uid, profile) {
  try {
    // Always save to unified 'users' collection with merge to avoid overwriting
    await setDoc(
      doc(db, "users", uid),
      {
        ...profile,
        updatedAt: new Date(),
      },
      { merge: true }
    );
    // Optionally, update specific collections if needed (e.g., students email)
    // But for now, unified is sufficient
    console.log("Profile saved successfully");
  } catch (error) {
    console.error("Error saving user profile:", error);
    throw error;
  }
}

// Admin Dashboard (Display Total Students)
async function getStudentCount(adminUid) {
  // Use subcollection count for accuracy (handles deletions)
  const studentsCol = collection(db, "admins", adminUid, "students");
  const snapshot = await getCountFromServer(studentsCol);
  return snapshot.data().count;
}

function loadAdminDashboard(adminUid, callback) {
  // Listen to student count changes
  const studentsCol = collection(db, "admins", adminUid, "students");
  onSnapshot(studentsCol, () => {
    getStudentCount(adminUid).then((count) => callback(count));
  });
}

// Sending Team-Wide Message
async function sendTeamMessage(adminUid, message) {
  try {
    // Add message to teamMessages subcollection
    await addDoc(collection(db, "admins", adminUid, "teamMessages"), {
      message: message,
      sender: "admin", // Or admin's name/ID
      timestamp: serverTimestamp(),
      isTeamMessage: true,
    });
    console.log("Team message sent");
  } catch (error) {
    console.error("Error sending team message:", error);
  }
}

// Sending Private Message to Specific Student
async function sendPrivateMessage(senderUid, studentUid, message) {
  try {
    await addDoc(collection(db, "privateMessages"), {
      senderUid: senderUid,
      receiverUid: studentUid,
      message: message,
      timestamp: serverTimestamp(),
      isPrivate: true,
    });
    console.log("Private message sent");
  } catch (error) {
    console.error("Error sending private message:", error);
  }
}

// Get list of students for admin (for private messaging)
async function getAdminStudents(adminUid) {
  const studentsCol = collection(db, "admins", adminUid, "students");
  const snapshot = await getDocs(studentsCol);
  return snapshot.docs.map((doc) => ({ uid: doc.data().uid, ...doc.data() }));
}

// Fixed Listening to Messages for Students (Team + Private Sent and Received for full conversations)
function listenToStudentMessages(studentUid, teamCallback, privateCallback) {
  return getDoc(doc(db, "students", studentUid))
    .then((studentDoc) => {
      if (!studentDoc.exists()) {
        console.warn("No student document found");
        return () => {};
      }
      const studentData = studentDoc.data();
      const adminUid = studentData.adminUid;
      const unsubscribes = [];
      // Listen to team messages
      if (adminUid && teamCallback) {
        const teamQuery = query(
          collection(db, `admins/${adminUid}/teamMessages`)
        );
        const unsubscribeTeam = onSnapshot(teamQuery, (snapshot) => {
          const messages = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          teamCallback(messages);
        });
        unsubscribes.push(unsubscribeTeam);
      }
      // Listen to private messages - combined sent and received
      if (privateCallback) {
        const allPrivateMessagesRef = { sent: [], received: [] };
        const updatePrivateMessages = () => {
          const combined = [
            ...allPrivateMessagesRef.sent,
            ...allPrivateMessagesRef.received,
          ].sort(
            (a, b) =>
              (a.timestamp?.toDate() || new Date(0)) -
              (b.timestamp?.toDate() || new Date(0))
          );
          privateCallback(combined.reverse()); // Newest first
        };
        // Listen to sent messages
        const sentQuery = query(
          collection(db, "privateMessages"),
          where("senderUid", "==", studentUid)
        );
        const unsubscribeSent = onSnapshot(sentQuery, (snapshot) => {
          allPrivateMessagesRef.sent = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          updatePrivateMessages();
        });
        unsubscribes.push(unsubscribeSent);
        // Listen to received messages
        const receivedQuery = query(
          collection(db, "privateMessages"),
          where("receiverUid", "==", studentUid)
        );
        const unsubscribeReceived = onSnapshot(receivedQuery, (snapshot) => {
          allPrivateMessagesRef.received = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          updatePrivateMessages();
        });
        unsubscribes.push(unsubscribeReceived);
      }
      return () => unsubscribes.forEach((unsub) => unsub());
    })
    .catch((error) => {
      console.error("Error setting up student message listeners:", error);
      return () => {};
    });
}

// Fixed Listening to Messages for Admins (Team + Private Sent and Received for full conversations)
function listenToAdminMessages(adminUid, teamCallback, privateCallback) {
  const unsubscribes = [];
  // Listen to team messages
  if (teamCallback) {
    const teamQuery = query(collection(db, `admins/${adminUid}/teamMessages`));
    const unsubscribeTeam = onSnapshot(teamQuery, (snapshot) => {
      const messages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      teamCallback(messages);
    });
    unsubscribes.push(unsubscribeTeam);
  }
  // Listen to private messages - combined sent and received
  if (privateCallback) {
    const allPrivateMessagesRef = { sent: [], received: [] };
    const updatePrivateMessages = () => {
      const combined = [
        ...allPrivateMessagesRef.sent,
        ...allPrivateMessagesRef.received,
      ].sort(
        (a, b) =>
          (a.timestamp?.toDate() || new Date(0)) -
          (b.timestamp?.toDate() || new Date(0))
      );
      privateCallback(combined.reverse()); // Newest first
    };
    // Listen to sent messages
    const sentQuery = query(
      collection(db, "privateMessages"),
      where("senderUid", "==", adminUid)
    );
    const unsubscribeSent = onSnapshot(sentQuery, (snapshot) => {
      allPrivateMessagesRef.sent = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      updatePrivateMessages();
    });
    unsubscribes.push(unsubscribeSent);
    // Listen to received messages
    const receivedQuery = query(
      collection(db, "privateMessages"),
      where("receiverUid", "==", adminUid)
    );
    const unsubscribeReceived = onSnapshot(receivedQuery, (snapshot) => {
      allPrivateMessagesRef.received = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      updatePrivateMessages();
    });
    unsubscribes.push(unsubscribeReceived);
  }
  return () => unsubscribes.forEach((unsub) => unsub());
}

// Export functions and Firebase instances
export {
  auth,
  db,
  adminSignup,
  studentSignup,
  login,
  loadAdminDashboard,
  getStudentCount,
  sendTeamMessage,
  sendPrivateMessage,
  getAdminStudents,
  listenToStudentMessages,
  listenToAdminMessages,
  onAuthStateChanged,
  signOut,
  getUserProfile,
  saveUserProfile,
};
