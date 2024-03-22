import axios from "axios";
import React, { useState } from "react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  IconButton,
  Spacer,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ChatState } from "../context/ChatProvider";
import ProfileModel from "./miscellaneous/ProfileModel";
import UpdateGroupChatModel from "./miscellaneous/UpdateGroupChatModel";
import { getSender, getSenderFull } from "../config/ChatLogics";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleGoBack = () => {
    setSelectedChat("");
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

      // If you're planning to use Socket.IO, uncomment the following lines
      // socket = io(ENDPOINT);
      // socket.emit("join chat", selectedChat._id);
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

  return (
    <>
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
                // fetchMessages={fetchMessages}
                fetchAgain={fetchAgain}
                setFetchAgain={setFetchAgain}
              />
            )}
            {!selectedChat.isGroupChat && (
              <ProfileModel user={getSenderFull(user, selectedChat.users)} />
            )}
          </Flex>
          <Box p={3} bg="#F7FAFC" minH="calc(100vh - 100px)" overflowY="auto">
            {/* Messages */}
          </Box>
        </>
      ) : (
        <Flex
          align="center"
          justify="center"
          h="calc(100vh - 100px)"
          color="gray.600"
        >
          <Text fontSize={{ base: "lg", md: "xl" }} textAlign="center">
            Click on a user to start chatting
          </Text>
        </Flex>
      )}
    </>
  );
};

export default SingleChat;
