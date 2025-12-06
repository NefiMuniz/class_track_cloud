import React, { useEffect, useState } from "react";
import { subscribeToUserAssignments } from "../../services/assignmentService";
import AssignmentCard from "./AssignmentCard";
import AssignmentForm from "./AssignmentForm";
import LoadingSpinner from "../Common/LoadingSpinner";
import "../../styles/assignments.css";
const AssignmentList = ({ userId, courses }) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filterCourse, setFilterCourse] = useState("all");
  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    const unsubscribe = subscribeToUserAssignments(
      userId,
      (updatedAssignments) => {
        setAssignments(updatedAssignments);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);
  const filteredAssignments =
    filterCourse === "all"
      ? assignments
      : assignments.filter((a) => a.courseId === filterCourse);
  if (loading) return;
  return (
    <div className="assignments-container">
      My Assignments
      <button onClick={() => setShowForm(!showForm)} className="btn-primary">
        {showForm ? "Cancel" : "+ Add Assignment"}
      </button>
      <div className="assignments-filter">
        <label htmlFor="filter">Filter by Course:</label>
        <select
          id="filter"
          value={filterCourse}
          onChange={(e) => setFilterCourse(e.target.value)}
        >
          <option value="all">All Courses</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name} ({course.code})
            </option>
          ))}
        </select>
      </div>
      {showForm && (
        <AssignmentForm
          userId={userId}
          courses={courses}
          onSuccess={() => setShowForm(false)}
        />
      )}
      {filteredAssignments.length === 0 ? (
        <p className="empty-message">No assignments yet.</p>
      ) : (
        <div className="assignments-list">
          {filteredAssignments.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              course={courses.find((c) => c.id === assignment.courseId)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
export default AssignmentList;
