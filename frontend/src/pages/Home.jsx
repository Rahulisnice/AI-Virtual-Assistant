import React, { useContext, useEffect, useRef, useState } from "react";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import playYouTubeVideo from "../context/Youtube";
import ai from "../assets/ai.gif";
import userImg from "../assets/user.gif";
import { RiMenu3Line } from "react-icons/ri";
import { GiCrossedBones } from "react-icons/gi";

const Home = () => {
  const { userData, serverUrl, setUserData, getGeminiResponse } =
    useContext(userDataContext);
  const navigate = useNavigate();
  const [listening, setListening] = useState(false);
  const [userText, setUserText] = useState("");
  const [aiText, setAiText] = useState("");
  const isSpeakingRef = useRef(false);
  const recognitionRef = useRef(null);
  const isRecognizingRef = useRef(false);
  const synth = window.speechSynthesis;
  const [ham, setHam] = useState(false);

  const handleLogout = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/logout`, {
        withCredentials: true,
      });
      setUserData(null);
      navigate("/login");
    } catch (error) {
      setUserData(null);
      console.error(error.message);
    }
  };

  const startRecognition = () => {
    if (!isSpeakingRef.current && !isRecognizingRef.current) {
      try {
        recognitionRef.current?.start();
        setListening(true);
      } catch (error) {
        if (!error.message.includes("start")) console.error(error);
      }
    }
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "hi-IN";
    const voices = window.speechSynthesis.getVoices();
    const hindiVoice = voices.find((v) => v.lang === "hi-IN");
    if (hindiVoice) {
      utterance.voice = hindiVoice;
    }

    isSpeakingRef.current = true;
    utterance.onend = () => {
      setAiText("");
      isSpeakingRef.current = false;
      setTimeout(() => {
        startRecognition();
      }, 800);
    };
    synth.cancel();
    synth.speak(utterance);
  };

  const handleCommand = (data) => {
    const { type, userInput, response } = data;
    speak(response);

    if (type === "google_search") {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`, "_blank");
    }
    if (type === "youtube_search") {
      const query = encodeURIComponent(userInput);
      window.open(
        `https://www.youtube.com/results?search_query=${query}`,
        "_blank"
      );
    }
    if (type === "youtube_play") {
      playYouTubeVideo(userInput);
    }
    if (type === "news_search") {
      const query = encodeURIComponent(userInput);
      window.open(`https://news.google.com/search?q=${query}`, "_blank");
    }
    if (type === "instagram_open") {
      window.open("https://www.instagram.com/", "_blank");
    }
    if (type === "facebook_open") {
      window.open("https://www.facebook.com/", "_blank");
    }
    if (type === "calculator_open") {
      window.open("https://www.google.com/search?q=calculator", "_blank");
    }
    if (type === "weather-show") {
      window.open("https://www.google.com/search?q=weather", "_blank");
    }
  };

  useEffect(() => {
    if (!userData) return;
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    (recognition.continuous = true), (recognition.lang = "en-IN");

    recognitionRef.current = recognition;

    let isMounted = true;
    const startTimeout = setTimeout(() => {
      if (isMounted && !isSpeakingRef.current && !isRecognizingRef.current) {
        try {
          recognition.start();
          console.log("recognition request to start");
        } catch (error) {
          if (error.name !== "InvalidStateError") {
            console.error(error);
          }
        }
      }
    }, 1000);

    recognition.onstart = () => {
      isRecognizingRef.current = true;
      setListening(true);
    };

    recognition.onend = () => {
      isRecognizingRef.current = false;
      setListening(false);
      if (isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          if (isMounted) {
            try {
              recognition.start();
              console.log("recognition restart");
            } catch (error) {
              if (error.name !== "InvalidStateError") {
                console.error(error);
              }
            }
          }
        }, 1000);
      }
    };

    recognition.onerror = (e) => {
      console.warn("Recognition error", e.error);
      isRecognizingRef.current = false;
      setListening(false);
      if (e.error !== "aborted" && isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          try {
            recognition.start();
            console.log("recognition restart after error");
          } catch (error) {
            if (error.name !== "InvalidStateError") {
              console.error(error);
            }
          }
        }, 1000);
      }
    };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();

      if (
        transcript.toLowerCase().includes(userData.assistantName.toLowerCase())
      ) {
        setAiText("");
        setUserText(transcript);
        recognition.stop();
        isRecognizingRef.current = false;
        setListening(false);
        const data = await getGeminiResponse(transcript);
        handleCommand(data);
        setAiText(data.response);
        setUserText("");
      }
    };

    const greeting = new SpeechSynthesisUtterance(
      `Hello ${userData.name}, how may I help you?`
    );
    greeting.lang = "hi-IN";
    window.speechSynthesis.speak(greeting);

    return () => {
      isMounted = false;
      recognition.stop();
      setListening(false);
      isRecognizingRef.current = false;
      clearTimeout(startTimeout);
    };
  }, []);

  return (
    <div className="w-full h-screen bg-gradient-to-t from-[#000000] to-[#050d52] flex justify-center items-center flex-col gap-4 relative px-4">
      {/* mobile screen sidebar */}
      <RiMenu3Line
        className="lg:hidden absolute top-[20px] right-[20px] w-[25px] h-[25px] cursor-pointer text-white"
        onClick={() => setHam(true)}
      />
      <div
        className={`absolute top-0 w-full h-full bg-[#00000053] backdrop-blur-lg p-[20px] lg:hidden ${
          ham ? "translate-x-0" : "translate-x-full"
        }
        transition-transform`}
      >
        <GiCrossedBones
          className="absolute top-[20px] right-[20px] w-[25px] h-[25px] cursor-pointer text-white"
          onClick={() => setHam(false)}
        />
        <button
          type="submit"
          onClick={() => handleLogout()}
          className="flex flex-col gap-3 px-10 py-4 bg-gradient-to-r from-blue-500 to-purple-600 
            hover:opacity-90 transition rounded-full text-white font-medium text-[17px] md:text-lg shadow-lg cursor-pointer mt-[82px] mb-[18px]"
        >
          Log Out
        </button>
        <button
          type="submit"
          onClick={() => navigate("/customize")}
          className="flex flex-col gap-3 px-10 py-4 bg-gradient-to-r from-blue-500 to-purple-600 
            hover:opacity-90 transition rounded-full text-white font-medium text-[17px] md:text-lg shadow-lg cursor-pointer mb-[18px]"
        >
          Customize Your Assistant
        </button>

        <div className="w-full h-[2px] bg-gray-400 "></div>
        <h1 className="text-white font-semibold text-[19px] mt-[10px]">
          History
        </h1>
        <div className="w-full h-[400px] gap-[20px] overflow-y-auto flex flex-col">
          {userData?.history?.map((his) => (
            <span className="text-gray-200 text-[17px] truncate">{his}</span>
          ))}
        </div>
      </div>
      {/* laptop screen buttons */}
      <button
        type="submit"
        onClick={() => handleLogout()}
        className=" absolute top-4 right-4  flex-col gap-3 px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-600 
            hover:opacity-90 transition rounded-full text-white font-medium text-sm md:text-lg shadow-lg cursor-pointer hidden lg:block"
      >
        Log Out
      </button>
      <button
        type="submit"
        onClick={() => navigate("/customize")}
        className="absolute top-20 right-4 flex-col gap-3 px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-600 
            hover:opacity-90 transition rounded-full text-white font-medium text-sm md:text-lg shadow-lg cursor-pointer hidden lg:block"
      >
        Customize Your Assistant
      </button>

      {/* Assistant Card */}
      <div className="w-[220px] h-[300px] md:w-[300px] md:h-[400px] flex justify-center items-center shadow-lg overflow-hidden rounded-2xl">
        <img
          src={userData?.assistantImage}
          className="h-full w-full object-cover"
          alt="Assistant"
        />
      </div>

      {/* Assistant Name */}
      <h1 className="text-white font-semibold text-lg md:text-2xl text-center">
        I'm {userData?.assistantName}
      </h1>
      {!aiText && <img src={userImg} className="w-[200px]" />}
      {aiText && <img src={ai} className="w-[200px]" />}
      <h1 className="text-white text-[18px] font-semibold text-wrap">
        {userText ? userText : aiText ? aiText : null}
      </h1>
    </div>
  );
};

export default Home;
