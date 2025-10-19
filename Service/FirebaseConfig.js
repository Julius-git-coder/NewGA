// FirebaseConfig.js - Complete Team ID Implementation
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

// Firebase configuration
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

/**
 * Admin Signup
 * Creates admin account and registers their unique Team ID
 * @param {string} email - Admin email
 * @param {string} password - Admin password
 * @param {string} teamId - Unique Team ID chosen by admin
 * @param {object} profileData - Additional profile data (name, phone, department, etc.)
 * @returns {Promise<object>} - User object
 */
async function adminSignup(email, password, teamId, profileData = {}) {
  try {
    // Validate Team ID format
    if (!teamId || teamId.length < 6) {
      throw new Error("Team ID must be at least 6 characters long");
    }

    // Check if Team ID already exists (must be unique)
    const teamIdQuery = query(
      collection(db, "admins"),
      where("teamId", "==", teamId),
      limit(1)
    );
    const querySnapshot = await getDocs(teamIdQuery);

    if (!querySnapshot.empty) {
      throw new Error(
        "This Team ID is already taken. Please choose another one."
      );
    }

    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Store admin data in Firestore
    await setDoc(doc(db, "admins", user.uid), {
      uid: user.uid,
      email: email,
      teamId: teamId, // Unique Team ID for this admin
      role: "admin",
      createdAt: serverTimestamp(),
      teamStudents: [], // Array of student UIDs
      ...profileData,
    });

    // Also store in users collection for unified access
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: email,
      teamId: teamId,
      role: "admin",
      createdAt: serverTimestamp(),
      ...profileData,
    });

    console.log("✅ Admin created successfully with Team ID:", teamId);
    return user;
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    throw error;
  }
}

/**
 * Student Signup
 * Creates student account and assigns them to admin's team using Team ID
 * @param {string} email - Student email
 * @param {string} password - Student password
 * @param {string} teamId - Admin's Team ID (must exist)
 * @param {object} profileData - Additional profile data (name, phone, studentId, etc.)
 * @returns {Promise<object>} - User object with admin assignment
 */
async function studentSignup(email, password, teamId, profileData = {}) {
  try {
    // Validate Team ID format
    if (!teamId || teamId.length < 6) {
      throw new Error("Team ID must be at least 6 characters long");
    }

    // Find admin by Team ID
    const adminsQuery = query(
      collection(db, "admins"),
      where("teamId", "==", teamId),
      limit(1)
    );
    const querySnapshot = await getDocs(adminsQuery);

    if (querySnapshot.empty) {
      throw new Error(
        "Invalid Team ID. No admin is registered with this ID. Please check with your administrator."
      );
    }

    // Get admin document
    const adminDoc = querySnapshot.docs[0];
    const adminUid = adminDoc.id;
    const adminData = adminDoc.data();

    console.log("✅ Found admin for Team ID:", teamId, "Admin UID:", adminUid);

    // Create student user with Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const studentUid = userCredential.user.uid;

    // Store student in admin's team subcollection
    await addDoc(collection(db, "admins", adminUid, "students"), {
      uid: studentUid,
      email: email,
      joinedAt: serverTimestamp(),
      ...profileData,
    });

    // Store student in top-level students collection
    await setDoc(doc(db, "students", studentUid), {
      uid: studentUid,
      email: email,
      adminUid: adminUid,
      teamId: teamId,
      role: "student",
      joinedAt: serverTimestamp(),
      ...profileData,
    });

    // Store in unified users collection
    await setDoc(doc(db, "users", studentUid), {
      uid: studentUid,
      email: email,
      adminUid: adminUid,
      teamId: teamId,
      role: "student",
      joinedAt: serverTimestamp(),
      ...profileData,
    });

    console.log("✅ Student assigned to admin team successfully");
    return {
      user: userCredential.user,
      adminUid: adminUid,
      teamId: teamId,
    };
  } catch (error) {
    console.error("❌ Error creating student:", error);
    throw error;
  }
}

/**
 * Login function
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object>} - User object
 */
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

/**
 * Get User Role and Data
 * Determines if user is admin or student and returns relevant data
 * @param {string} uid - User ID from Firebase Auth
 * @returns {Promise<object>} - User data with role
 */
async function getUserRole(uid) {
  try {
    // Check unified users collection first
    const userDocRef = doc(db, "users", uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      return {
        role: userData.role,
        teamId: userData.teamId,
        adminUid: userData.adminUid || null,
        ...userData,
      };
    }

    // Fallback: Check admin collection
    const adminDocRef = doc(db, "admins", uid);
    const adminDocSnap = await getDoc(adminDocRef);

    if (adminDocSnap.exists()) {
      const adminData = adminDocSnap.data();
      return {
        role: "admin",
        teamId: adminData.teamId,
        ...adminData,
      };
    }

    // Fallback: Check student collection
    const studentDocRef = doc(db, "students", uid);
    const studentDocSnap = await getDoc(studentDocRef);

    if (studentDocSnap.exists()) {
      const studentData = studentDocSnap.data();
      return {
        role: "student",
        teamId: studentData.teamId,
        adminUid: studentData.adminUid,
        ...studentData,
      };
    }

    throw new Error("User not found in database");
  } catch (error) {
    console.error("Error getting user role:", error);
    throw error;
  }
}

/**
 * Verify Team ID exists
 * Utility function to check if a Team ID is valid
 * @param {string} teamId
 * @returns {Promise<boolean>}
 */
async function verifyTeamId(teamId) {
  try {
    const adminsQuery = query(
      collection(db, "admins"),
      where("teamId", "==", teamId),
      limit(1)
    );
    const querySnapshot = await getDocs(adminsQuery);
    return !querySnapshot.empty;
  } catch (error) {
    console.error("Error verifying Team ID:", error);
    return false;
  }
}

/**
 * Get User Profile
 * @param {string} uid
 * @returns {Promise<object>}
 */
async function getUserProfile(uid) {
  try {
    const userDocRef = doc(db, "users", uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const profile = userDocSnap.data();
      if (profile.joinedAt) {
        profile.startDate = profile.joinedAt.toDate().toLocaleDateString();
      }
      return profile;
    }

    // Fallback to role-specific collections
    const adminDocRef = doc(db, "admins", uid);
    const adminDocSnap = await getDoc(adminDocRef);

    if (adminDocSnap.exists()) {
      return adminDocSnap.data();
    }

    const studentDocRef = doc(db, "students", uid);
    const studentDocSnap = await getDoc(studentDocRef);

    if (studentDocSnap.exists()) {
      return studentDocSnap.data();
    }

    return null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
}

/**
 * Save User Profile
 * @param {string} uid
 * @param {object} profile
 */
async function saveUserProfile(uid, profile) {
  try {
    await setDoc(
      doc(db, "users", uid),
      {
        ...profile,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    console.log("Profile saved successfully");
  } catch (error) {
    console.error("Error saving user profile:", error);
    throw error;
  }
}

/**
 * Get Student Count for Admin
 * @param {string} adminUid
 * @returns {Promise<number>}
 */
async function getStudentCount(adminUid) {
  const studentsCol = collection(db, "admins", adminUid, "students");
  const snapshot = await getCountFromServer(studentsCol);
  return snapshot.data().count;
}

/**
 * Load Admin Dashboard
 * @param {string} adminUid
 * @param {function} callback
 */
function loadAdminDashboard(adminUid, callback) {
  const studentsCol = collection(db, "admins", adminUid, "students");
  onSnapshot(studentsCol, () => {
    getStudentCount(adminUid).then((count) => callback(count));
  });
}

/**
 * Send Team Message
 * @param {string} adminUid
 * @param {string} message
 */
async function sendTeamMessage(adminUid, message) {
  try {
    await addDoc(collection(db, "admins", adminUid, "teamMessages"), {
      message: message,
      sender: "admin",
      timestamp: serverTimestamp(),
      isTeamMessage: true,
    });
    console.log("Team message sent");
  } catch (error) {
    console.error("Error sending team message:", error);
  }
}

/**
 * Send Private Message
 * @param {string} senderUid
 * @param {string} receiverUid
 * @param {string} message
 */
async function sendPrivateMessage(senderUid, receiverUid, message) {
  try {
    await addDoc(collection(db, "privateMessages"), {
      senderUid: senderUid,
      receiverUid: receiverUid,
      message: message,
      timestamp: serverTimestamp(),
      isPrivate: true,
    });
    console.log("Private message sent");
  } catch (error) {
    console.error("Error sending private message:", error);
  }
}

// Export functions
export {
  auth,
  db,
  adminSignup,
  studentSignup,
  login,
  getUserRole,
  verifyTeamId,
  getUserProfile,
  saveUserProfile,
  loadAdminDashboard,
  getStudentCount,
  sendTeamMessage,
  sendPrivateMessage,
  onAuthStateChanged,
  signOut,
};
