import React, { useEffect, useState } from "react";
import { subscribeToUserCourses } from "../../services/courseService";
import CourseCard from "./CourseCard";
import CourseForm from "./CourseForm";
import LoadingSpinner from "../Common/LoadingSpinner";
import "../../styles/courses.css";
const CourseList = ({ userId }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    const unsubscribe = subscribeToUserCourses(userId, (updatedCourses) => {
      setCourses(updatedCourses);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);
  if (loading) return;
  return (
    <div className="courses-container">
      My Courses
      <button onClick={() => setShowForm(!showForm)} className="btn-primary">
        {showForm ? "Cancel" : "+ Add Course"}
      </button>
      {showForm && (
        <CourseForm userId={userId} onSuccess={() => setShowForm(false)} />
      )}
      {courses.length === 0 ? (
        <p className="empty-message">No courses yet. Add one to get started!</p>
      ) : (
        <div className="courses-grid">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};
export default CourseList;
