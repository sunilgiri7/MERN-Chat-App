import { Route, Routes } from "react-router-dom";
import "./App.css";
import { HomePage } from "./pages/HomePage";
import { ChatPage } from "./pages/ChatPage";
import Login from "./components/Authentication/Login";
import Signup from "./components/Authentication/Signup";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/chats" element={<ChatPage />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </div>
  );
}

export default App;
