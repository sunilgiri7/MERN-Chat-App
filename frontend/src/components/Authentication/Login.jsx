import React, { useEffect, useState } from "react";
import studyLogin from "./assets/studyLogin.svg";
import "./login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    if (!email || !password) {
      alert("Please fill in all the required fields");
      setLoading(false);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        config
      );
      alert("Login successful");
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      history("/chats");
    } catch (error) {
      console.error(
        "Login Error:",
        error.response ? error.response.data : error.message
      );
      alert(
        "Login Failed: " +
          (error.response
            ? error.response.data.message
            : "Unknown error occurred")
      );
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    setEmail("guest@gmail.com");
    setPassword("guest123");
  };

  return (
    <div className="login">
      {/* RED PART */}
      <div className="redPart">
        <img className="studyLogin" src={studyLogin} alt="Study Login" />
        <span className="quotes">
          <hr className="line" />
          "Anyone who stops learning is old, whether at
          <br />
          twenty or eighty. Anyone who keeps learning
          <br />
          stays young"
        </span>
      </div>

      {/* WHITE PART */}
      <div className="whitePart">
        <h1 className="loginTitle" style={{ marginBottom: "20px" }}>
          LOGIN
        </h1>
        <form className="loginForm" onSubmit={handleSubmit}>
          <div className="formGroup">
            <input
              type="email"
              className="loginEmail"
              placeholder="Enter your email.."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="formGroup">
            <input
              type="password"
              className="loginPassword"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="forgotPassword">Forgot Password?</div>
            <button className="loginButton" type="submit" disabled={loading}>
              {loading ? "Loading..." : "Login"}
            </button>
            <button
              className="loginGuest"
              type="button"
              onClick={handleGuestLogin}
            >
              Log in as Guest
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
