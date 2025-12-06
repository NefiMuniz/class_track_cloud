import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn } from '../../services/authService';
import ErrorMessage from '../Common/ErrorMessage';
import '../../styles/auth.css';
const SignIn = () => {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState('');
const [loading, setLoading] = useState(false);
const navigate = useNavigate();
const handleSignIn = async (e) => {
e.preventDefault();
setError('');
setLoading(true);
try {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  await signIn(email, password);
  navigate('/dashboard');
} catch (err) {
  setError(err.message || 'Failed to sign in');
} finally {
  setLoading(false);
}

};
return (
<div className="auth-container">
<div className="auth-card">
Sign In

{error}
<form onSubmit={handleSignIn}>
Email
<input
id="email"
type="email"
value={email}
onChange={(e) => setEmail(e.target.value)}
placeholder="Enter your email"
disabled={loading}
/>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          disabled={loading}
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>

    <p className="auth-link">
      Don't have an account? <a href="/signup">Sign Up</a>
    </p>
  </div>
</div>

);
};
export default SignIn;
