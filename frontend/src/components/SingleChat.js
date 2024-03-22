import axios from "axios";
import React, { useState, useEffect } from "react";
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

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const toast = useToast();

  useEffect(() => {
    if (selectedChat) {
      fetchMessages();
    }
  }, [selectedChat]);

  const handleGoBack = () => {
    setSelectedChat("");
  };

  const fetchMessages = async () => {
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
  };

  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage.trim() !== "") {
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
  };

  return (
    <Flex direction="column" h="100%">
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
