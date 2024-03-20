import React, { useState, useEffect } from "react";
import { ChatState } from "../context/ChatProvider";
import SideBar from "../components/miscellaneous/SideBar";
import MyChats from "../components/miscellaneous/MyChats";
import ChatBox from "../components/miscellaneous/ChatBox";
import "./MyChatBox.css";

export const ChatPage = () => {
  const { user } = ChatState();
  const [userName, setUserName] = useState("");

  // Set the user's name when the component mounts
  useEffect(() => {
    if (user && user.name) {
      setUserName(user.name);
    }
  }, [user]);

  return (
    <div>
      <div>
        <div className="navbar">
          <div className="navbar-brand">Chat App</div>
          <div className="profile-icon">
            <span className="avatar-circle">
              <i className="fas fa-user-circle"></i>
            </span>
            <button
              className="btn btn-transparent"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasRight"
              aria-controls="offcanvasRight" // Handle the click event
            >
              {userName}
            </button>
          </div>
        </div>
        <div className="chat-page">
          {user && <SideBar />}
          <div className="chats-box">{user && <MyChats />}</div>
          <div className="chats-box">{user && <ChatBox />}</div>
        </div>
      </div>
      {/* Render the offcanvas component conditionally */}
      <div>
        <div
          className="offcanvas offcanvas-end"
          tabIndex="-1"
          id="offcanvasRight"
          aria-labelledby="offcanvasRightLabel"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasRightLabel">
              Offcanvas right
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
              // onClick={() => setUsernameClicked(false)} // Close the offcanvas
            ></button>
          </div>
          <div className="offcanvas-body">Profile</div>
        </div>{" "}
      </div>
    </div>
  );
};
