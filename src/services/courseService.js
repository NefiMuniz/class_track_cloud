import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../config/firebase";

/**
 * Add a new course
 * @param {string} userId - User's ID
 * @param {object} courseData - Course data (name, code, color, credits, semester)
 * @returns {Promise} Created course with ID
 */
export const addCourse = async (userId, courseData) => {
  try {
    const docRef = await addDoc(collection(db, "courses"), {
      userId,
      ...courseData,
      createdAt: new Date(),
    });
    return { id: docRef.id, ...courseData };
  } catch (error) {
    console.error("Error adding course:", error);
    throw error;
  }
};

/**
 * Fetch all courses for a user (one-time fetch)
 * @param {string} userId - User's ID
 * @returns {Promise} Array of course objects
 */
export const getUserCourses = async (userId) => {
  try {
    const q = query(collection(db, "courses"), where("userId", "==", userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};

/**
 * Subscribe to real-time course updates for a user
 * @param {string} userId - User's ID
 * @param {function} callback - Function to call with updated courses
 * @returns {function} Unsubscribe function
 */
export const subscribeToUserCourses = (userId, callback) => {
  try {
    const q = query(collection(db, "courses"), where("userId", "==", userId));
    return onSnapshot(
      q,
      (snapshot) => {
        const courses = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        }));
        callback(courses);
      },
      (error) => {
        console.error("Error subscribing to courses:", error);
      }
    );
  } catch (error) {
    console.error("Error setting up course listener:", error);
    throw error;
  }
};

/**
 * Update a course
 * @param {string} courseId - Course's ID
 * @param {object} updateData - Fields to update
 * @returns {Promise} void
 */
export const updateCourse = async (courseId, updateData) => {
  try {
    await updateDoc(doc(db, "courses", courseId), updateData);
  } catch (error) {
    console.error("Error updating course:", error);
    throw error;
  }
};

/**
 * Delete a course only (no cascade)
 * @param {string} courseId - Course's ID
 * @returns {Promise} void
 */
export const deleteCourse = async (courseId) => {
  try {
    await deleteDoc(doc(db, "courses", courseId));
  } catch (error) {
    console.error("Error deleting course:", error);
    throw error;
  }
};

/**
 * Delete a course AND all its assignments (cascade behavior)
 * @param {string} courseId - Course's ID
 * @returns {Promise<void>}
 */
export const deleteCourseAndAssignments = async (courseId) => {
  try {
    // 1. Delete all assignments with this courseId
    const assignmentsQuery = query(
      collection(db, "assignments"),
      where("courseId", "==", courseId)
    );
    const assignmentsSnapshot = await getDocs(assignmentsQuery);

    const deletePromises = assignmentsSnapshot.docs.map((docSnap) =>
      deleteDoc(doc(db, "assignments", docSnap.id))
    );

    await Promise.all(deletePromises);

    // 2. Delete the course itself
    await deleteDoc(doc(db, "courses", courseId));
  } catch (error) {
    console.error("Error deleting course and assignments:", error);
    throw error;
  }
};
