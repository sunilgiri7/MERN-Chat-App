import axios from "axios";
import React, { useState, useEffect, useCallback } from "react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  FormControl,
  IconButton,
  Input,
  Spacer,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ChatState } from "../context/ChatProvider";
import ProfileModel from "./miscellaneous/ProfileModel";
import UpdateGroupChatModel from "./miscellaneous/UpdateGroupChatModel";
import { getSender, getSenderFull } from "../config/ChatLogics";
import "./styles.css";
import ScrollableChats from "./ScrollableChats";
import { io } from "socket.io-client";
import Lottie from "react-lottie";
import animation from "../animation/typing.json";

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setsocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const toast = useToast();

  const fetchMessages = useCallback(async () => {
    if (!selectedChat) return;

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  }, [selectedChat, user.token, toast]);

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setsocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    return () => {
      // Clean up the socket connection when the component unmounts
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages();

      selectedChatCompare = selectedChat;
    }
  }, [selectedChat, fetchMessages]);

  useEffect(() => {
    const getSenderFull = (loggedUser, users) => {
      return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
    };
    socket.on("Message Received", async (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        try {
          // Save the notification to the database
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          const { data } = await axios.post(
            "/api/notifications",
            {
              userId: user._id,
              message: `New message from ${getSenderFull(
                user,
                newMessageReceived.chat.users
              )}`,
            },
            config
          );
          console.log("Notification saved:", data);

          if (!notification.includes(newMessageReceived)) {
            setNotification([newMessageReceived, ...notification]);
            setFetchAgain(!fetchAgain);
          }
        } catch (error) {
          console.error("Error saving notification:", error);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  const handleGoBack = () => {
    setSelectedChat("");
  };

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage.trim() !== "") {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        socket.emit("new message", data);
        // Update the messages state with the newly sent message
        setMessages([...messages, data]);

        // Clear the input field after sending the message
        setNewMessage("");
      } catch (error) {
        toast({
          title: "Error Occurred!",
          description: "Failed to Send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    const timerLength = 2000; // 3 seconds
    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
        // Reset isTyping to false after the delay
        // setIsTyping(false);
      }
    }, timerLength);
  };

  return (
    <Flex direction="column" h="100%" w="100%">
      {selectedChat ? (
        <>
          <Flex
            align="center"
            justify="space-between"
            p={2}
            borderBottom="1px solid #E2E8F0"
          >
            <IconButton
              icon={<ArrowBackIcon />}
              onClick={handleGoBack}
              aria-label="Go Back"
              mr={2}
              borderRadius="full"
              marginBottom="10px"
            />
            <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold">
              {selectedChat.isGroupChat
                ? selectedChat.chatName.toUpperCase()
                : getSender(user, selectedChat.users)}
            </Text>
            <Spacer />
            {selectedChat.isGroupChat && (
              <UpdateGroupChatModel
                fetchAgain={fetchAgain}
                setFetchAgain={setFetchAgain}
                fetchMessages={fetchMessages}
              />
            )}
            {!selectedChat.isGroupChat && (
              <ProfileModel user={getSenderFull(user, selectedChat.users)} />
            )}
          </Flex>
          <Box flex="1" p={3} bg="#F7FAFC" overflowY="auto">
            {/* Messages */}
            {loading ? (
              <Spinner size="xl" alignSelf="center" margin="auto" />
            ) : (
              <div className="messages">
                <ScrollableChats messages={messages} />
              </div>
            )}
          </Box>

          <FormControl p={3} borderTop="1px solid #E2E8F0" bg="#F7FAFC">
            {isTyping ? (
              <Flex align="center">
                <Text fontSize="sm" color="gray.500">
                  <Lottie
                    options={{
                      loop: true,
                      autoplay: true,
                      animationData: animation,
                    }}
                    height={50} // Adjust the height as needed
                    width={50} // Adjust the width as needed
                  />
                </Text>
              </Flex>
            ) : null}
            <Input
              variant="filled"
              bg="#E0E0E0"
              placeholder="Enter a message..."
              onChange={typingHandler}
              value={newMessage}
              onKeyDown={sendMessage}
            />
          </FormControl>
        </>
      ) : (
        <Flex align="center" justify="center" flex="1" color="gray.600">
          <Text fontSize={{ base: "lg", md: "xl" }} textAlign="center">
            Click on a user to start chatting
          </Text>
        </Flex>
      )}
    </Flex>
  );
};

export default SingleChat;
