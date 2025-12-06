import React from "react";
// import "../../styles/statistics.css";

const Statistics = ({ courses, assignments }) => {
  const totalCourses = courses.length;
  const totalAssignments = assignments.length;
  const completedAssignments = assignments.filter((a) => a.completed).length;
  const completionRate =
    totalAssignments > 0
      ? Math.round((completedAssignments / totalAssignments) * 100)
      : 0;

  const totalPoints = assignments.reduce((sum, a) => sum + (a.points || 0), 0);
  const earnedPoints = assignments
    .filter((a) => a.completed)
    .reduce((sum, a) => sum + (a.points || 0), 0);

  const overdueTasks = assignments.filter((a) => {
    if (a.completed) return false;
    const dueDate = new Date(a.dueDate);
    return dueDate < new Date();
  }).length;

  return (
    <div className="statistics-container">
      <h2>Statistics Overview</h2>
      <div className="statistics-grid">
        <div className="stat-card stat-courses">
          <div className="stat-value">{totalCourses}</div>
          <div className="stat-label">Courses</div>
        </div>

        <div className="stat-card stat-assignments">
          <div className="stat-value">{totalAssignments}</div>
          <div className="stat-label">Total Assignments</div>
        </div>

        <div className="stat-card stat-completed">
          <div className="stat-value">{completedAssignments}</div>
          <div className="stat-label">Completed</div>
        </div>

        <div className="stat-card stat-rate">
          <div className="stat-value">{completionRate}%</div>
          <div className="stat-label">Completion Rate</div>
        </div>

        <div className="stat-card stat-points">
          <div className="stat-value">
            {earnedPoints}/{totalPoints}
          </div>
          <div className="stat-label">Points Earned</div>
        </div>

        <div
          className={`stat-card stat-overdue ${
            overdueTasks > 0 ? "warning" : ""
          }`}
        >
          <div className="stat-value">{overdueTasks}</div>
          <div className="stat-label">Overdue Tasks</div>
        </div>
      </div>

      {totalAssignments > 0 && (
        <div className="progress-bar-container">
          <div className="progress-label">Overall Progress</div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
          <div className="progress-text">
            {completedAssignments} of {totalAssignments} completed
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistics;
