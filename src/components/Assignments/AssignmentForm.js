import React, { useState } from 'react';
import { addAssignment } from '../../services/assignmentService';
import ErrorMessage from '../Common/ErrorMessage';
import '../../styles/assignments.css';
const AssignmentForm = ({ userId, courses, onSuccess }) => {
const [title, setTitle] = useState('');
const [courseId, setCourseId] = useState('');
const [dueDate, setDueDate] = useState('');
const [priority, setPriority] = useState('medium');
const [points, setPoints] = useState('100');
const [notes, setNotes] = useState('');
const [error, setError] = useState('');
const [loading, setLoading] = useState(false);
const handleSubmit = async (e) => {
e.preventDefault();
setError('');
setLoading(true);
try {
  if (!title || !courseId || !dueDate) {
    throw new Error('Title, course, and due date are required');
  }

  await addAssignment(userId, {
    title,
    courseId,
    dueDate,
    priority,
    points: parseInt(points),
    notes,
  });

  // Reset form
  setTitle('');
  setCourseId('');
  setDueDate('');
  setPriority('medium');
  setPoints('100');
  setNotes('');
  
  if (onSuccess) onSuccess();
} catch (err) {
  setError(err.message || 'Failed to add assignment');
} finally {
  setLoading(false);
}

};
return (
<form className="assignment-form" onSubmit={handleSubmit}>
Add New Assignment

{error}
  <div className="form-group">
    <label htmlFor="title">Assignment Title</label>
    <input
      id="title"
      type="text"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      placeholder="e.g., Chapter 5 Project"
      disabled={loading}
    />
  </div>

  <div className="form-group">
    <label htmlFor="courseId">Course</label>
    <select
      id="courseId"
      value={courseId}
      onChange={(e) => setCourseId(e.target.value)}
      disabled={loading}
    >
      <option value="">Select a course</option>
      {courses.map((course) => (
        <option key={course.id} value={course.id}>
          {course.name} ({course.code})
        </option>
      ))}
    </select>
  </div>

  <div className="form-row">
    <div className="form-group">
      <label htmlFor="dueDate">Due Date</label>
      <input
        id="dueDate"
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        disabled={loading}
      />
    </div>

    <div className="form-group">
      <label htmlFor="priority">Priority</label>
      <select
        id="priority"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        disabled={loading}
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    </div>
  </div>

  <div className="form-group">
    <label htmlFor="points">Points</label>
    <input
      id="points"
      type="number"
      value={points}
      onChange={(e) => setPoints(e.target.value)}
      min="0"
      disabled={loading}
    />
  </div>

  <div className="form-group">
    <label htmlFor="notes">Notes</label>
    <textarea
      id="notes"
      value={notes}
      onChange={(e) => setNotes(e.target.value)}
      placeholder="Add any notes or requirements"
      rows="3"
      disabled={loading}
    />
  </div>

  <button type="submit" disabled={loading} className="btn-primary">
    {loading ? 'Adding...' : 'Add Assignment'}
  </button>
</form>

);
};
export default AssignmentForm;
