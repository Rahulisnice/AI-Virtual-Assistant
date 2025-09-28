import React, { useContext, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import authBg from "../assets/authBg.png";
import axios from "axios";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const { serverUrl, setUserData } = useContext(userDataContext);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/user/register`,
        {
          name,
          email,
          password,
        },
        { withCredentials: true }
      );

      setUserData(result.data);
      setLoading(false);
      navigate("/customize");
    } catch (error) {
      console.error(error.message);
      setUserData(null);
      setLoading(false);
      setErr(error.response.data.message);
    }
  };

  return (
    <div
      className="w-full h-screen bg-cover bg-center flex justify-center items-center relative"
      style={{ backgroundImage: `url(${authBg})` }}
    >
      <form
        className="relative z-10 w-[90%] max-w-[480px] 
        bg-black/20 backdrop-blur-md border border-white/30 
        rounded-2xl shadow-2xl flex flex-col items-center gap-6 px-8 py-10 text-white"
        onSubmit={handleSignUp}
      >
        {/* Title */}
        <h1 className="text-3xl font-semibold text-center">
          Register To <span className="text-blue-400">Virtual Assistant</span>
        </h1>

        {/* Name */}
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter Your Name"
          className="w-full h-12 px-5 rounded-full bg-white/20 border border-white/40 
          text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-12 px-5 rounded-full bg-white/20 border border-white/40 
          text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Password */}
        <div className="w-full relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-12 px-5 pr-12 rounded-full bg-white/20 border border-white/40 
            text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <span
            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <AiOutlineEyeInvisible size={22} />
            ) : (
              <AiOutlineEye size={22} />
            )}
          </span>
        </div>

        {/* Error */}
        {err.length > 0 && <p className="text-red-500 text-[17px]">*{err}</p>}

        {/* Button */}
        <button
          type="submit"
          className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-600 
          hover:opacity-90 transition rounded-full text-white font-semibold text-lg shadow-lg cursor-pointer"
          disabled={loading}
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>

        {/* Footer */}
        <p className="text-gray-200 text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-blue-300 hover:underline">
            Login
          </a>
        </p>
        <h1 className="text-red-500 font-bold">
          Note: You need to say the assistant name to use it
        </h1>
        <h1 className="text-red-500 font-bold">
          For best experience use chrome browser
        </h1>
      </form>
    </div>
  );
};

export default SignUp;
