import React, { useEffect } from "react";
import "./Homepage.css";
import { useNavigate } from "react-router-dom";

export const HomePage = () => {
  const history = useNavigate();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) history("/home");
  }, [history]);

  return (
    <div className="homepage-container">
      <div className="header">
        <h1 className="app-name">Your Chat App</h1>
      </div>
      <div className="main-content">
        <div className="welcome-message">
          <h2>Welcome to Your Chat App</h2>
          <p>Start chatting with your friends and family</p>
        </div>
        <div className="start-chat-button">
          <a href="/chats">
            <button>Start Chatting</button>
          </a>
        </div>
      </div>
      <div className="footer">
        <p>&copy; 2024 Your Chat App. All rights reserved.</p>
      </div>
    </div>
  );
};
