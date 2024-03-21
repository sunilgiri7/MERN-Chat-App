import React, { useState } from "react";
import {
  Flex,
  Text,
  Button,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Box,
  Input,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Tooltip,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import ProfileModel from "./ProfileModel";
import { ChatState } from "../../context/ChatProvider";
import { useDisclosure } from "@chakra-ui/hooks";
import axios from "axios";
import { ChatLoading } from "../ChatLoading";
import UserListItem from "../userAvatar/UserListItem";

function SideDrawer() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const {
    setSelectedChat,
    user,
    notification,
    setNotification,
    chats,
    setChats,
  } = ChatState();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure(); // Correct placement of useDisclosure

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };
  const toast = useToast();
  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please enter a search term",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`, // Use backticks for string interpolation
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config); // Correct the typo and add a closing brace
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error occured!",
        description: "Failed to load the search results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    } finally {
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`, // Use backticks for string interpolation
        },
      };
      const { data } = await axios.post("/api/chat", { userId }, config);
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoading(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error occured!",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        bg="green"
        p="5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search User to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text d={{ base: "none", md: "flex" }} px="3" marginTop="3">
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text
          fontSize="2xl"
          fontFamily="Work sans"
          textAlign="center"
          flex="1"
          marginTop="2"
        >
          Pigeons
        </Text>
        <Menu>
          <MenuButton p={1}>
            <BellIcon marginBottom="1" />
          </MenuButton>
          {/* <MenuList>
            <MenuItem>Notification 1</MenuItem>
          </MenuList> */}
        </Menu>
        <Menu>
          <MenuButton
            marginBottom="1"
            as={Button}
            rightIcon={<ChevronDownIcon />}
            background="none"
          >
            <Avatar
              size="sm"
              cursor="pointer"
              name={user.name}
              src={user.pic}
            />
          </MenuButton>
          <MenuList>
            <ProfileModel user={user}>
              <MenuItem>My Profile</MenuItem>
            </ProfileModel>
            <MenuDivider />
            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search User</DrawerHeader>
          <DrawerBody>
            <Box d="flex" pb={2}>
              <Input
                placeholder="search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <Button display="flex" onClick={handleSearch}>
                Go
              </Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SideDrawer;
