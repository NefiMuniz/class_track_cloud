import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { onAuthChange } from "./services/authService";
import SignUp from "./components/Auth/SignUp";
import SignIn from "./components/Auth/SignIn";
import Dashboard from "./components/Dashboard/Dashboard";
import LoadingSpinner from "./components/Common/LoadingSpinner";
import "./App.css";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div className="loading-page">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/signup"
          element={currentUser ? <Navigate to="/dashboard" /> : <SignUp />}
        />
        <Route
          path="/signin"
          element={currentUser ? <Navigate to="/dashboard" /> : <SignIn />}
        />
        <Route
          path="/dashboard"
          element={
            currentUser ? (
              <Dashboard user={currentUser} />
            ) : (
              <Navigate to="/signin" />
            )
          }
        />
        <Route
          path="/"
          element={
            currentUser ? (
              <Navigate to="/dashboard" />
            ) : (
              <Navigate to="/signin" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
