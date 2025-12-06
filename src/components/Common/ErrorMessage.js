import React from "react";
const ErrorMessage = ({ message }) => {
  if (!message) return null;
  return { message };
};
export default ErrorMessage;
