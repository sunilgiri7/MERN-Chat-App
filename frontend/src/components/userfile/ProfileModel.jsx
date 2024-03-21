import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons"; // Change to free-regular-svg-icons for the edit icon
import {
  faFacebookF,
  faTwitter,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons"; // Import from free-brands-svg-icons for social media icons
import "./profileModel.css";
import { ChatState } from "../../context/ChatProvider";

function ProfileModel() {
  const { user } = ChatState();
  const [userName, setUserName] = useState("");

  // Set the user's name when the component mounts
  useEffect(() => {
    if (user && user.name) {
      setUserName(user.name);
    }
  }, [user]);
  return (
    <>
      <div>
        <section className="vh-100 bg-color">
          <div className="container py-5 h-100">
            <div className="row d-flex justify-content-center align-items-center h-100">
              <div className="col col-lg-6 mb-4 mb-lg-0">
                <div className="card mb-3 rounded-custom">
                  <div className="row g-0">
                    <div className="col-md-4 gradient-custom text-center text-white rounded-start">
                      {user && user.pic && (
                        <img
                          src={user.pic}
                          alt="Avatar"
                          className="img-fluid my-5"
                          style={{ width: "80px" }}
                        />
                      )}
                      <h5>Sunil</h5>
                      <p>Web Designer</p>
                      <FontAwesomeIcon icon={faEdit} className="mb-5" />
                    </div>
                    <div className="col-md-8">
                      <div className="card-body p-4">
                        <h6>Hello, {user.name}</h6>
                        <hr className="mt-0 mb-4" />
                        <div className="row pt-1">
                          <div className="col-6 mb-3">
                            <h6>Email</h6>
                            <p className="text-muted">{user.email}</p>
                          </div>
                          <div className="col-6 mb-3">
                            <h6>Profile ID</h6>
                            <p className="text-muted">{user._id}</p>
                          </div>
                        </div>
                        <hr className="mt-0 mb-4" />
                        <div className="row pt-1"></div>
                        <div className="d-flex justify-content-start">
                          <a href="#!">
                            <FontAwesomeIcon
                              icon={faFacebookF}
                              className="me-3 fa-lg"
                            />
                          </a>
                          <a href="#!">
                            <FontAwesomeIcon
                              icon={faTwitter}
                              className="me-3 fa-lg"
                            />
                          </a>
                          <a href="#!">
                            <FontAwesomeIcon
                              icon={faInstagram}
                              className="fa-lg"
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default ProfileModel;
