import React from "react";
// import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import ChatProvider from "./context/ChatProvider";

// Import createRoot from react-dom/client
import { createRoot } from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";

// Use createRoot instead of ReactDOM.render
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider>
      <BrowserRouter>
        <ChatProvider>
          <App />
        </ChatProvider>
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>
);
