import React, { useState } from "react";
import studyLogin from "./assets/studyLogin.svg";
import "./signup.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const history = useNavigate();

  const submitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill all the required fields");
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      alert("Password not matched");
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
        `${process.env.REACT_APP_BASE_URL_BACKEND}api/user`,
        { name, email, password, file },
        config
      );
      alert("Registration successful");
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      history("/login");
    } catch (err) {
      console.log(err);
      alert("Error Occured: " + err);
      setLoading(false);
    }
  };

  const handleFileChange = (pics) => {
    setLoading(true);
    if (!pics) {
      alert("Please select an Image!");
      setLoading(false);
      return;
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "dijtsdohg");
      fetch("https://api.cloudinary.com/v1_1/dijtsdohg/image/upload", {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setFile(data.url.toString());
          console.log(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error uploading image:", err);
          alert("Error uploading image. Please try again later.");
          setLoading(false);
        });
    } else {
      alert("Please select an Image!");
      setLoading(false);
      return;
    }
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
          SIGNUP
        </h1>
        <form className="loginForm" onSubmit={submitHandler}>
          <div className="formGroup">
            <input
              type="text"
              className="loginEmail"
              placeholder="Enter your Username.."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
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
          </div>
          <div className="formGroup">
            <input
              type="password"
              className="loginPassword"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="formGroup">
            <input
              className="loginEmail"
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e.target.files[0])}
            />
          </div>
          <div className="forgotPassword">
            Already have an account? <a href="/login">Login Here</a>
          </div>
          <button className="loginButton" type="submit" disabled={loading}>
            {loading ? "Loading..." : "Signup"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
