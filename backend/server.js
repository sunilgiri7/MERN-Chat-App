const express = require("express");
const dotenv = require("dotenv");
const { chats } = require("./data/data");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { Socket } = require("socket.io");
const { emit } = require("nodemon");
const notificationsRouter = require("./routes/notifications");
const Notification = require("./models/Notification"); // Import the Notification model
const express = require("express");
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Enable CORS for all routes
app.use(
  cors({
    origin: "https://main--chatapp0011.netlify.app", // Replace with your Netlify app URL
  })
);

// Your API routes
app.post("/api/user/login", (req, res) => {
  // ...
});

app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/notifications", notificationsRouter);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, console.log(`Listening on port: ${PORT}`));

const io = require("socket.io")(server, {
  pingTimeout: 50000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("user joined room" + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", async (newMessageReceived) => {
    var chat = newMessageReceived.chat;
    if (!chat.users) return console.log("chat.users not defined");

    // Create a new notification for each recipient
    chat.users.forEach(async (user) => {
      if (user._id == newMessageReceived.sender._id) return;

      try {
        const notification = new Notification({
          userId: user._id,
          message: `New message from ${newMessageReceived.sender.name}`,
        });
        await notification.save();
        socket.in(user._id).emit("Message Received", newMessageReceived);
      } catch (error) {
        console.error("Error saving notification:", error);
      }
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
