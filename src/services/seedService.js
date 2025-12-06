import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../config/firebase";

/**
 * Sample courses for seeding
 */
const SAMPLE_COURSES = [
  {
    name: "Web Development",
    code: "CSE310",
    color: "#3182ce",
    credits: 3,
    semester: "Spring 2025",
  },
  {
    name: "Data Structures",
    code: "CSE220",
    color: "#38a169",
    credits: 4,
    semester: "Spring 2025",
  },
  {
    name: "Software Engineering",
    code: "CSE330",
    color: "#ed8936",
    credits: 3,
    semester: "Spring 2025",
  },
  {
    name: "Database Systems",
    code: "CSE340",
    color: "#9f7aea",
    credits: 3,
    semester: "Spring 2025",
  },
];

/**
 * Sample assignments (will be linked to courses)
 */
const SAMPLE_ASSIGNMENTS = [
  {
    title: "React Todo App",
    courseCode: "CSE310",
    dueDate: "2025-12-15",
    priority: "high",
    points: 100,
    notes: "Build a todo app with React, add/delete/complete features",
  },
  {
    title: "Firebase Integration",
    courseCode: "CSE310",
    dueDate: "2025-12-22",
    priority: "high",
    points: 150,
    notes: "Integrate Firebase for real-time updates",
  },
  {
    title: "Array Sorting Algorithms",
    courseCode: "CSE220",
    dueDate: "2025-12-10",
    priority: "medium",
    points: 50,
    notes: "Implement bubble sort, quick sort, merge sort",
  },
  {
    title: "Binary Search Tree Implementation",
    courseCode: "CSE220",
    dueDate: "2025-12-18",
    priority: "high",
    points: 100,
    notes: "Implement BST with insert, delete, search",
  },
  {
    title: "Design Pattern Analysis",
    courseCode: "CSE330",
    dueDate: "2025-12-20",
    priority: "medium",
    points: 75,
    notes: "Analyze Singleton, Factory, Observer patterns",
  },
  {
    title: "SQL Queries",
    courseCode: "CSE340",
    dueDate: "2025-12-12",
    priority: "medium",
    points: 60,
    notes: "Write complex JOIN queries with GROUP BY",
  },
];

/**
 * Seed demo data for a user
 * @param {string} userId - User's Firebase UID
 * @returns {Promise} Success message
 */
export const seedDemoData = async (userId) => {
  try {
    console.log("Starting demo data seeding...");

    // Step 1: Create sample courses
    const courseMap = {}; // Map courseCode to courseId

    for (const courseData of SAMPLE_COURSES) {
      const docRef = await addDoc(collection(db, "courses"), {
        userId,
        ...courseData,
        createdAt: new Date(),
      });
      courseMap[courseData.code] = docRef.id;
      console.log(`✓ Created course: ${courseData.name} (${docRef.id})`);
    }

    // Step 2: Create sample assignments linked to courses
    let assignmentCount = 0;
    for (const assignmentData of SAMPLE_ASSIGNMENTS) {
      const courseId = courseMap[assignmentData.courseCode];

      if (!courseId) {
        console.warn(
          `⚠ Course ${assignmentData.courseCode} not found, skipping assignment`
        );
        continue;
      }

      const { courseCode, ...assignData } = assignmentData;

      await addDoc(collection(db, "assignments"), {
        userId,
        courseId,
        ...assignData,
        completed: false,
        createdAt: new Date(),
      });
      assignmentCount++;
      console.log(`✓ Created assignment: ${assignmentData.title}`);
    }

    console.log(`✓ Demo data seeded successfully!`);
    console.log(`  - ${Object.keys(courseMap).length} courses created`);
    console.log(`  - ${assignmentCount} assignments created`);

    return {
      success: true,
      coursesCreated: Object.keys(courseMap).length,
      assignmentsCreated: assignmentCount,
    };
  } catch (error) {
    console.error("Error seeding demo data:", error);
    throw error;
  }
};

/**
 * Clear all user data (courses and assignments)
 * @param {string} userId - User's Firebase UID
 * @returns {Promise} Number of documents deleted
 */
export const clearUserData = async (userId) => {
  try {
    console.log("Clearing user data...");
    let deletedCount = 0;

    // Delete all courses
    const coursesQuery = query(
      collection(db, "courses"),
      where("userId", "==", userId)
    );
    const coursesSnapshot = await getDocs(coursesQuery);

    for (const docSnap of coursesSnapshot.docs) {
      await deleteDoc(doc(db, "courses", docSnap.id));
      deletedCount++;
      console.log(`✓ Deleted course: ${docSnap.id}`);
    }

    // Delete all assignments
    const assignmentsQuery = query(
      collection(db, "assignments"),
      where("userId", "==", userId)
    );
    const assignmentsSnapshot = await getDocs(assignmentsQuery);

    for (const docSnap of assignmentsSnapshot.docs) {
      await deleteDoc(doc(db, "assignments", docSnap.id));
      deletedCount++;
      console.log(`✓ Deleted assignment: ${docSnap.id}`);
    }

    console.log(`✓ Cleared ${deletedCount} documents`);
    return deletedCount;
  } catch (error) {
    console.error("Error clearing user data:", error);
    throw error;
  }
};

/**
 * Get demo data statistics
 * @param {string} userId - User's Firebase UID
 * @returns {Promise} Statistics object
 */
export const getDemoDataStats = async (userId) => {
  try {
    const coursesQuery = query(
      collection(db, "courses"),
      where("userId", "==", userId)
    );
    const assignmentsQuery = query(
      collection(db, "assignments"),
      where("userId", "==", userId)
    );

    const coursesSnapshot = await getDocs(coursesQuery);
    const assignmentsSnapshot = await getDocs(assignmentsQuery);

    return {
      courses: coursesSnapshot.size,
      assignments: assignmentsSnapshot.size,
      total: coursesSnapshot.size + assignmentsSnapshot.size,
    };
  } catch (error) {
    console.error("Error getting demo data stats:", error);
    throw error;
  }
};
