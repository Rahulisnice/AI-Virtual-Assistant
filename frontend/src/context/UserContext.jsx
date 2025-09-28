import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const userDataContext = createContext();

const UserContext = ({ children }) => {
  const serverUrl =
    "ai-virtual-assistant-qnwt5iar6-rahul-yadavs-projects-325ccd1c.vercel.app";
  const [userData, setUserData] = useState(null);
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleCurrentUser = async (req, res) => {
    try {
      const result = await axios.get(`${serverUrl}/api/person/current`, {
        withCredentials: true,
      });
      setUserData(result.data);
      console.log(result.data);
    } catch (error) {
      console.error(error.message);
    }
  };

  const getGeminiResponse = async (command) => {
    try {
      const { data } = await axios.post(
        `${serverUrl}/api/person/asktoassistant`,
        { command },
        { withCredentials: true }
      );
      return data;
    } catch (err) {
      console.error("Gemini API failed:", err.response?.data || err.message);
      return null;
    }
  };

  useEffect(() => {
    handleCurrentUser();
  }, []);

  const value = {
    serverUrl,
    userData,
    setUserData,
    backendImage,
    setBackendImage,
    frontendImage,
    getGeminiResponse,
    setFrontendImage,
    selectedImage,
    setSelectedImage,
  };
  return (
    <div>
      <userDataContext.Provider value={value}>
        {children}
      </userDataContext.Provider>
    </div>
  );
};

export default UserContext;
