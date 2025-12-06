import React, { useState } from 'react';
import { addCourse } from '../../services/courseService';
import ErrorMessage from '../Common/ErrorMessage';
import '../../styles/courses.css';
const CourseForm = ({ userId, onSuccess }) => {
const [name, setName] = useState('');
const [code, setCode] = useState('');
const [color, setColor] = useState('#3182ce');
const [credits, setCredits] = useState('3');
const [semester, setSemester] = useState('');
const [error, setError] = useState('');
const [loading, setLoading] = useState(false);
const handleSubmit = async (e) => {
e.preventDefault();
setError('');
setLoading(true);
try {
  if (!name || !code || !credits || !semester) {
    throw new Error('All fields are required');
  }

  await addCourse(userId, {
    name,
    code,
    color,
    credits: parseInt(credits),
    semester,
  });

  // Reset form
  setName('');
  setCode('');
  setColor('#3182ce');
  setCredits('3');
  setSemester('');
  
  if (onSuccess) onSuccess();
} catch (err) {
  setError(err.message || 'Failed to add course');
} finally {
  setLoading(false);
}

};
return (
<form className="course-form" onSubmit={handleSubmit}>
Add New Course

{error}
  <div className="form-group">
    <label htmlFor="name">Course Name</label>
    <input
      id="name"
      type="text"
      value={name}
      onChange={(e) => setName(e.target.value)}
      placeholder="e.g., Web Development"
      disabled={loading}
    />
  </div>

  <div className="form-group">
    <label htmlFor="code">Course Code</label>
    <input
      id="code"
      type="text"
      value={code}
      onChange={(e) => setCode(e.target.value)}
      placeholder="e.g., CSE310"
      disabled={loading}
    />
  </div>

  <div className="form-row">
    <div className="form-group">
      <label htmlFor="credits">Credits</label>
      <input
        id="credits"
        type="number"
        value={credits}
        onChange={(e) => setCredits(e.target.value)}
        min="1"
        max="6"
        disabled={loading}
      />
    </div>

    <div className="form-group">
      <label htmlFor="color">Color</label>
      <input
        id="color"
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        disabled={loading}
      />
    </div>
  </div>

  <div className="form-group">
    <label htmlFor="semester">Semester</label>
    <select
      id="semester"
      value={semester}
      onChange={(e) => setSemester(e.target.value)}
      disabled={loading}
    >
      <option value="">Select semester</option>
      <option value="Spring 2025">Spring 2025</option>
      <option value="Summer 2025">Summer 2025</option>
      <option value="Fall 2025">Fall 2025</option>
      <option value="Winter 2025">Winter 2025</option>
    </select>
  </div>

  <button type="submit" disabled={loading} className="btn-primary">
    {loading ? 'Adding...' : 'Add Course'}
  </button>
</form>

);
};
export default CourseForm;
