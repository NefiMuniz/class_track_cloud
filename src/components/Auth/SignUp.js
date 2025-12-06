import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp } from '../../services/authService';
import ErrorMessage from '../Common/ErrorMessage';
import '../../styles/auth.css';
const SignUp = () => {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [displayName, setDisplayName] = useState('');
const [error, setError] = useState('');
const [loading, setLoading] = useState(false);
const navigate = useNavigate();
const handleSignUp = async (e) => {
e.preventDefault();
setError('');
setLoading(true);
try {
  if (!email || !password || !displayName) {
    throw new Error('All fields are required');
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }

  await signUp(email, password, displayName);
  navigate('/dashboard');
} catch (err) {
  setError(err.message || 'Failed to sign up');
} finally {
  setLoading(false);
}

};
return (
<div className="auth-container">
<div className="auth-card">
Sign Up

{error}
<form onSubmit={handleSignUp}>
Full Name
<input
id="displayName"
type="text"
value={displayName}
onChange={(e) => setDisplayName(e.target.value)}
placeholder="Enter your full name"
disabled={loading}
/>

      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password (min 6 characters)"
          disabled={loading}
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Creating account...' : 'Sign Up'}
      </button>
    </form>

    <p className="auth-link">
      Already have an account? <a href="/signin">Sign In</a>
    </p>
  </div>
</div>

);
};
export default SignUp;
