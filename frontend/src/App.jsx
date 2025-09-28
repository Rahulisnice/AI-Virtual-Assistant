import React, { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import SignUp from "./pages/signUp";
import SignIn from "./pages/SignIn";
import Customize from "./pages/customize";
import Customize2 from "./pages/customize2";
import { userDataContext } from "./context/UserContext";
import Home from "./pages/Home";

const App = () => {
  const { userData } = useContext(userDataContext);
  return (
    <Routes>
      <Route
        path="/"
        element={
          userData?.assistantImage && userData?.assistantName ? (
            <Home />
          ) : (
            <Navigate to="/customize" />
          )
        }
      />
      <Route
        path="/register"
        element={!userData ? <SignUp /> : <Navigate to="/" />}
      />
      <Route
        path="/login"
        element={!userData ? <SignIn /> : <Navigate to="/" />}
      />
      <Route
        path="/customize"
        element={userData ? <Customize /> : <Navigate to="/register" />}
      />
      <Route
        path="/customize2"
        element={userData ? <Customize2 /> : <Navigate to="/register" />}
      />
    </Routes>
  );
};

export default App;
