import {
collection,
addDoc,
query,
where,
getDocs,
doc,
updateDoc,
deleteDoc,
onSnapshot
} from 'firebase/firestore';
import { db } from '../config/firebase';
/**
•	Add a new assignment
•	@param {string} userId - User's ID
•	@param {object} assignmentData - Assignment data (title, courseId, dueDate, priority, points, etc.)
•	@returns {Promise} Created assignment with ID
*/
export const addAssignment = async (userId, assignmentData) => {
try {
const docRef = await addDoc(collection(db, 'assignments'), {
userId,
...assignmentData,
completed: false,
createdAt: new Date(),
});
return { id: docRef.id, ...assignmentData };
} catch (error) {
console.error('Error adding assignment:', error);
throw error;
}
};
/**
•	Fetch all assignments for a user
•	@param {string} userId - User's ID
•	@returns {Promise} Array of assignment objects
*/
export const getUserAssignments = async (userId) => {
try {
const q = query(collection(db, 'assignments'), where('userId', '==', userId));
const snapshot = await getDocs(q);
return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
} catch (error) {
console.error('Error fetching assignments:', error);
throw error;
}
};
/**
•	Subscribe to real-time assignment updates for a user
•	@param {string} userId - User's ID
•	@param {function} callback - Function to call with updated assignments
•	@returns {function} Unsubscribe function
*/
export const subscribeToUserAssignments = (userId, callback) => {
try {
const q = query(collection(db, 'assignments'), where('userId', '==', userId));
return onSnapshot(q, (snapshot) => {
const assignments = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
callback(assignments);
}, (error) => {
console.error('Error subscribing to assignments:', error);
});
} catch (error) {
console.error('Error setting up assignment listener:', error);
throw error;
}
};
/**
•	Fetch assignments for a specific course
•	@param {string} userId - User's ID
•	@param {string} courseId - Course's ID
•	@returns {Promise} Array of assignment objects
*/
export const getAssignmentsByCourse = async (userId, courseId) => {
try {
const q = query(
collection(db, 'assignments'),
where('userId', '', userId),where('courseId', '', courseId)
);
const snapshot = await getDocs(q);
return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
} catch (error) {
console.error('Error fetching assignments by course:', error);
throw error;
}
};
/**
•	Update an assignment
•	@param {string} assignmentId - Assignment's ID
•	@param {object} updateData - Fields to update
•	@returns {Promise} void
*/
export const updateAssignment = async (assignmentId, updateData) => {
try {
await updateDoc(doc(db, 'assignments', assignmentId), updateData);
} catch (error) {
console.error('Error updating assignment:', error);
throw error;
}
};
/**
•	Delete an assignment
•	@param {string} assignmentId - Assignment's ID
•	@returns {Promise} void
*/
export const deleteAssignment = async (assignmentId) => {
try {
await deleteDoc(doc(db, 'assignments', assignmentId));
} catch (error) {
console.error('Error deleting assignment:', error);
throw error;
}
};
/**
•	Toggle assignment completion status
•	@param {string} assignmentId - Assignment's ID
•	@param {boolean} completed - New completion status
•	@returns {Promise} void
*/
export const toggleAssignmentCompletion = async (assignmentId, completed) => {
try {
await updateDoc(doc(db, 'assignments', assignmentId), { completed });
} catch (error) {
console.error('Error toggling assignment completion:', error);
throw error;
}
};
