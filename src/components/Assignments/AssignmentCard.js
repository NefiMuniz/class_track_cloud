// src/components/Assignments/AssignmentCard.js
import React, { useState } from "react";
import {
  deleteAssignment,
  toggleAssignmentCompletion,
  updateAssignment,
} from "../../services/assignmentService";
import "../../styles/assignments.css";

const AssignmentCard = ({ assignment, course }) => {
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(assignment.title);
  const [editedDueDate, setEditedDueDate] = useState(assignment.dueDate);
  const [editedPriority, setEditedPriority] = useState(assignment.priority);
  const [editedPoints, setEditedPoints] = useState(assignment.points || 0);
  const [editedNotes, setEditedNotes] = useState(assignment.notes || "");

  const handleToggleCompletion = async () => {
    setLoading(true);
    try {
      await toggleAssignmentCompletion(assignment.id, !assignment.completed);
    } catch (error) {
      console.error("Error toggling completion:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this assignment?"))
      return;

    setLoading(true);
    try {
      await deleteAssignment(assignment.id);
    } catch (error) {
      console.error("Error deleting assignment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = async () => {
    setLoading(true);
    try {
      await updateAssignment(assignment.id, {
        title: editedTitle,
        dueDate: editedDueDate,
        priority: editedPriority,
        points: Number(editedPoints) || 0,
        notes: editedNotes,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating assignment:", error);
    } finally {
      setLoading(false);
    }
  };

  const dueDate = new Date(assignment.dueDate);
  const today = new Date();
  const isOverdue = dueDate < today && !assignment.completed;
  const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

  const priorityClass = `priority-${assignment.priority}`;

  return (
    <div
      className={`assignment-card ${
        assignment.completed ? "completed" : ""
      } ${priorityClass}`}
    >
      <div className="assignment-checkbox">
        <input
          type="checkbox"
          checked={assignment.completed}
          onChange={handleToggleCompletion}
          disabled={loading}
        />
      </div>

      <div className="assignment-content">
        {isEditing ? (
          <>
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              disabled={loading}
            />
            <div className="form-row">
              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  value={editedDueDate}
                  onChange={(e) => setEditedDueDate(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select
                  value={editedPriority}
                  onChange={(e) => setEditedPriority(e.target.value)}
                  disabled={loading}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Points</label>
                <input
                  type="number"
                  value={editedPoints}
                  onChange={(e) => setEditedPoints(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Notes</label>
              <textarea
                rows="2"
                value={editedNotes}
                onChange={(e) => setEditedNotes(e.target.value)}
                disabled={loading}
              />
            </div>
          </>
        ) : (
          <>
            <h4>{assignment.title}</h4>
            {course && (
              <p className="assignment-course">
                {course.name} ({course.code})
              </p>
            )}
            {assignment.notes && (
              <p className="assignment-notes">{assignment.notes}</p>
            )}
          </>
        )}
      </div>

      <div className="assignment-meta">
        <span className={`due-date ${isOverdue ? "overdue" : ""}`}>
          {dueDate.toLocaleDateString()}
          {!assignment.completed &&
            daysUntilDue >= 0 &&
            ` (${daysUntilDue} days)`}
        </span>
        <span className="points">{assignment.points} pts</span>
      </div>

      <div className="assignment-actions">
        {isEditing ? (
          <>
            <button
              onClick={handleSaveEdit}
              disabled={loading}
              className="btn-small btn-success"
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
          </>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

export default AssignmentCard;
