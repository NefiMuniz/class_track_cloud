import React from 'react';
import { logOut } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
const SignOut = ({ onSignOut }) => {
const navigate = useNavigate();
const handleSignOut = async () => {
try {
await logOut();
if (onSignOut) onSignOut();
navigate('/signin');
} catch (error) {
console.error('Error signing out:', error);
}
};
return (SignOut);
};
export default SignOut;
