import React, { useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/authBg.png";
import image4 from "../assets/image4.png";
import image5 from "../assets/image5.png";
import image6 from "../assets/image6.jpeg";
import image7 from "../assets/image7.jpeg";
import Card from "../components/Card";
import { LuImagePlus } from "react-icons/lu";
import { userDataContext } from "../context/UserContext";
import { IoMdArrowRoundBack } from "react-icons/io";

const customize = () => {
  const navigate = useNavigate();
  const {
    setBackendImage,
    frontendImage,
    setFrontendImage,
    selectedImage,
    setSelectedImage,
  } = useContext(userDataContext);
  const inputImage = useRef();

  const handleImage = () => {
    const file = inputImage.current.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-[#000000] to-[#050d52]  flex justify-center items-center flex-col p-[20px] ">
      <IoMdArrowRoundBack
        onClick={() => navigate("/")}
        className="absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer"
      />
      <h1 className="text-white mb-[40px] font-semibold text-[30px] text-center">
        Select Your <span className="text-blue-400">Assistant Image</span>
      </h1>
      <div className="flex flex-wrap items-center justify-center w-full max-w-[900px] gap-[20px] ">
        <Card image={image1} />
        <Card image={image2} />
        <Card image={image3} />
        <Card image={image4} />
        <Card image={image5} />
        <Card image={image6} />
        <Card image={image7} />
        <div
          className={`w-[70px] h-[140px] md:w-[120px] md:h-[220px] lg:w-[150px] lg:h-[250px] bg-[#02021f] border-2 border-[#0000ff63] rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-900 cursor-pointer hover:border-4 hover:border-white flex items-center justify-center ${
            selectedImage === "input"
              ? "border-4 border-white shadow-2xl shadow-blue-900 "
              : null
          }`}
          onClick={() => {
            inputImage.current.click(), setSelectedImage("input");
          }}
        >
          {!frontendImage && (
            <LuImagePlus className="text-white w-[25px] h-[25px] " />
          )}

          {frontendImage && (
            <img src={frontendImage} className="h-full object-cover" />
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          hidden
          ref={inputImage}
          onChange={handleImage}
        />
      </div>
      {selectedImage && (
        <button
          className="min-w-[120px] mt-[30px] h-[60px] bg-gradient-to-r from-blue-500 to-purple-600 
          hover:opacity-90 transition rounded-full text-white font-semibold text-lg shadow-lg cursor-pointer"
          onClick={() => navigate("/customize2")}
        >
          Next
        </button>
      )}
    </div>
  );
};

export default customize;
