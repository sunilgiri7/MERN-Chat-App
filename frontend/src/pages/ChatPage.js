import React, { useState, useEffect, useRef } from "react";
import { ChatState } from "../context/ChatProvider";
import { useNavigate } from "react-router-dom";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";
import { Box } from "@chakra-ui/layout";

export const ChatPage = () => {
  const { user } = ChatState();
  // const [userName, setUserName] = useState("");
  // const [showLogoutModal, setShowLogoutModal] = useState(false);
  // const logoutModalRef = useRef(null);
  // const offcanvasRef = useRef(null);
  // const [modalInstance, setModalInstance] = useState(null);

  // const history = useNavigate();

  // // Set the user's name when the component mounts
  // useEffect(() => {
  //   if (user && user.name) {
  //     setUserName(user.name);
  //   }
  // }, [user]);

  // useEffect(() => {
  //   const logoutModal = logoutModalRef.current;
  //   if (showLogoutModal && logoutModal) {
  //     const modal = new window.bootstrap.Modal(logoutModal, {});
  //     modal.show();
  //     setModalInstance(modal); // Store the modal instance

  //     // Remove the backdrop when the modal is hidden
  //     modal._element.addEventListener("hidden.bs.modal", () => {
  //       const backdrop = document.querySelector(".modal-backdrop");
  //       if (backdrop) {
  //         backdrop.remove();
  //       }
  //     });
  //   }
  // }, [showLogoutModal]);

  // const handleLogoutClick = () => {
  //   // Close the offcanvas
  //   const offcanvas = offcanvasRef.current;
  //   if (offcanvas) {
  //     const offcanvasInstance =
  //       window.bootstrap.Offcanvas.getInstance(offcanvas);
  //     offcanvasInstance.hide();
  //   }
  //   setShowLogoutModal(true);
  //   localStorage.removeItem("userInfo");
  //   history("/login");
  // };

  // const handleConfirmLogout = () => {
  //   // Perform logout action here
  //   console.log("Logout confirmed");
  //   setShowLogoutModal(false);
  //   modalInstance.hide();
  // };

  // const handleCancelLogout = () => {
  //   // User canceled logout
  //   console.log("Logout canceled");
  //   setShowLogoutModal(false); // Close the modal
  //   modalInstance.hide(); // Hide the modal
  // };

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box d="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        {user && <MyChats />}
        {user && <ChatBox />}
      </Box>
    </div>
  );
};
