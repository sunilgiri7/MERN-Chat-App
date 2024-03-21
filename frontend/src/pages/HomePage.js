import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const HomePage = () => {
  const history = useNavigate();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) history("/chats");
  }, [history]);

  return <div>Homepage</div>;
};
