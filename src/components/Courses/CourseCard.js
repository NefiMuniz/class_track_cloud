import React, { useState } from "react";
import {
  updateCourse,
  deleteCourseAndAssignments,
} from "../../services/courseService";
import "../../styles/courses.css";

const CourseCard = ({ course }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(course.name);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!editedName) return;

    setLoading(true);
    try {
      await updateCourse(course.id, { name: editedName });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating course:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this course and all its assignments?"
      )
    ) {
      setLoading(true);
      try {
        // Cascade delete: course + its assignments
        await deleteCourseAndAssignments(course.id);
      } catch (error) {
        console.error("Error deleting course and assignments:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="course-card" style={{ borderLeftColor: course.color }}>
      <div className="course-header">
        <h3>{course.code}</h3>
        <span className="course-credits">{course.credits} credits</span>
      </div>

      {isEditing ? (
        <div className="course-edit">
          <input
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            disabled={loading}
          />
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="btn-small btn-primary"
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            disabled={loading}
            className="btn-small btn-secondary"
          >
            Cancel
          </button>
        </div>
      ) : (
        <>
          <p className="course-name">{editedName}</p>
          <p className="course-semester">{course.semester}</p>
          <div className="course-actions">
            <button
              onClick={() => setIsEditing(true)}
              disabled={loading}
              className="btn-small btn-secondary"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="btn-small btn-danger"
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CourseCard;
