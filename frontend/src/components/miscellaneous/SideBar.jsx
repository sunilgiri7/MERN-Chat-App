// SideBar.jsx
import React, { useState } from "react";
import "./Sidebar.css";
import { ChatState } from "../../context/ChatProvider";

function SideBar() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState("");
  const [leading, setLoading] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { user } = ChatState();

  return (
    <div className="sidebar">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          // onChange={handleSearch}
        />
      </div>
      <div className="contacts-list"></div>
    </div>
  );
}

export default SideBar;
