import React, { useEffect, useState } from "react";
import { subscribeToUserCourses } from "../../services/courseService";
import { subscribeToUserAssignments } from "../../services/assignmentService";
import {
  seedDemoData,
  clearUserData,
  getDemoDataStats,
} from "../../services/seedService";
import CourseList from "../Courses/CourseList";
import AssignmentList from "../Assignments/AssignmentList";
import Statistics from "./Statistics";
import Navbar from "../Common/Navbar";
import LoadingSpinner from "../Common/LoadingSpinner";
import "../../styles/dashboard.css";

const Dashboard = ({ user }) => {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seedLoading, setSeedLoading] = useState(false);
  const [seedMessage, setSeedMessage] = useState("");
  const [demoStats, setDemoStats] = useState(null);

  useEffect(() => {
    if (!user?.uid) return;

    setLoading(true);

    // Subscribe to real-time course updates
    const unsubscribeCourses = subscribeToUserCourses(
      user.uid,
      (updatedCourses) => {
        setCourses(updatedCourses);
        setLoading(false);
      }
    );

    // Subscribe to real-time assignment updates
    const unsubscribeAssignments = subscribeToUserAssignments(
      user.uid,
      (updatedAssignments) => {
        setAssignments(updatedAssignments);
      }
    );

    // Cleanup subscriptions on unmount
    return () => {
      unsubscribeCourses();
      unsubscribeAssignments();
    };
  }, [user?.uid]);

  const handleSeedData = async () => {
    if (
      window.confirm(
        "This will add 4 sample courses and 6 sample assignments. Continue?"
      )
    ) {
      setSeedLoading(true);
      setSeedMessage("");
      try {
        const result = await seedDemoData(user.uid);
        setSeedMessage(
          `✓ Demo data seeded! ${result.coursesCreated} courses + ${result.assignmentsCreated} assignments`
        );
        setTimeout(() => setSeedMessage(""), 5000);
      } catch (error) {
        setSeedMessage(`✗ Error: ${error.message}`);
      } finally {
        setSeedLoading(false);
      }
    }
  };

  const handleClearData = async () => {
    if (
      window.confirm(
        "This will DELETE all your courses and assignments. This cannot be undone. Continue?"
      )
    ) {
      setSeedLoading(true);
      setSeedMessage("");
      try {
        const deleted = await clearUserData(user.uid);
        setSeedMessage(`✓ Cleared ${deleted} documents`);
        setTimeout(() => setSeedMessage(""), 5000);
      } catch (error) {
        setSeedMessage(`✗ Error: ${error.message}`);
      } finally {
        setSeedLoading(false);
      }
    }
  };

  const handleCheckStats = async () => {
    try {
      const stats = await getDemoDataStats(user.uid);
      setDemoStats(stats);
      console.log("Demo Data Stats:", stats);
    } catch (error) {
      console.error("Error getting stats:", error);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="dashboard">
      <Navbar user={user} />

      <main className="dashboard-main">
        <Statistics courses={courses} assignments={assignments} />

        {/* Seed Controls */}
        <div className="seed-controls">
          <h3>Demo Controls</h3>
          <div className="seed-buttons">
            <button
              onClick={handleSeedData}
              disabled={seedLoading}
              className="btn btn-primary"
            >
              {seedLoading ? "Seeding..." : "📥 Seed Demo Data"}
            </button>
            <button
              onClick={handleCheckStats}
              disabled={seedLoading}
              className="btn btn-secondary"
            >
              📊 Check Stats
            </button>
            <button
              onClick={handleClearData}
              disabled={seedLoading}
              className="btn btn-danger"
            >
              🗑️ Clear All Data
            </button>
          </div>

          {seedMessage && (
            <div
              className={`seed-message ${
                seedMessage.includes("✓") ? "success" : "error"
              }`}
            >
              {seedMessage}
            </div>
          )}

          {demoStats && (
            <div className="seed-stats">
              <p>
                📈 Current Data: <strong>{demoStats.courses} courses</strong>,{" "}
                <strong>{demoStats.assignments} assignments</strong>
              </p>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="dashboard-content">
          <CourseList userId={user.uid} />
          <AssignmentList userId={user.uid} courses={courses} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
