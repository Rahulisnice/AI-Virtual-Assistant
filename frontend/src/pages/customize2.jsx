import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/UserContext";
import axios from "axios";
import { IoMdArrowRoundBack } from "react-icons/io";

const customize2 = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { userData, backendImage, selectedImage, serverUrl, setUserData } =
    useContext(userDataContext);
  const [assistantName, setAssistantName] = useState(
    userData?.Assistantname || ""
  );

  const handleUpdateAssistant = async () => {
    setLoading(true);
    try {
      let formData = new FormData();
      formData.append("assistantName", assistantName);
      if (backendImage) {
        formData.append("assistantImage", backendImage);
      } else {
        formData.append("imageUrl", selectedImage);
      }

      const result = await axios.post(
        `${serverUrl}/api/person/update`,
        formData,
        { withCredentials: true }
      );

      setLoading(false);
      console.log(result.data);
      setUserData(result.data);
      navigate("/");
    } catch (error) {
      setLoading(false);
      console.error(error.message);
    }
  };

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-[#000000] to-[#050d52]  flex justify-center items-center flex-col p-[20px] relative ">
      <IoMdArrowRoundBack
        onClick={() => navigate("/customize")}
        className="absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer"
      />
      <h1 className="text-white mb-[40px] font-semibold text-[30px] text-center">
        Enter Your <span className="text-blue-400">Assistant Name</span>
      </h1>
      <input
        type="text"
        placeholder="e.g. Jarvis"
        required
        value={assistantName}
        className="w-full max-w-[600px] h-12 px-5 rounded-full bg-white/20 border border-white/40 
          text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
        onChange={(e) => setAssistantName(e.target.value)}
      />
      {assistantName && (
        <button
          className="min-w-[300px] mt-[30px] h-[60px] bg-gradient-to-r from-blue-500 to-purple-600 
          hover:opacity-90 transition rounded-full text-white font-semibold text-lg shadow-lg cursor-pointer"
          disabled={loading}
          onClick={() => {
            handleUpdateAssistant();
          }}
        >
          {loading ? "Please Wait..." : "Finally Create Your Assistant"}
        </button>
      )}
    </div>
  );
};

export default customize2;
