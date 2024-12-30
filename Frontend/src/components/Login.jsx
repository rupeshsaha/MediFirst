import React, { useContext, useState, useEffect } from "react";
import { StoreContext } from "../store/StoreContext";

const Login = ({ defaultIsOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultIsOpen);
  const [userType, setUserType] = useState("Patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [responseCode, setResponseCode] = useState("");

  const { setLoggedInUserType } = useContext(StoreContext);

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const handleUserType = (type) => {
    setUserType(type);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginDetails = { email, password };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/${userType}/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginDetails),
          credentials: "include",
        }
      );

      const data = await response.json();
      setResponseMessage(data.message);
      setResponseCode(response.status);

      if (response.status === 200) {
        setEmail("");
        setPassword("");
        setResponseMessage("");
        setLoggedInUserType(userType);
        togglePopup()
      }
    } catch (error) {
      console.error("Error while login: ", error);
    }
  };

  return (
    <div>
      {!defaultIsOpen && (
        <button
          onClick={togglePopup}
          className="w-full text-blue-500 border-blue-500 border px-4 py-2 rounded-md hover:bg-blue-600 hover:text-white transition duration-300"
        >
          Login
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white m-2 rounded-md p-6 w-full max-w-md shadow-lg relative">
            <button
              onClick={togglePopup}
              className="absolute top-1 right-2 text-gray-500 hover:text-red-700"
            >
              ✕
            </button>

            {/* User Type Toggle */}
            <div className="flex justify-center gap-4 mb-6 p-2">
              <button
                onClick={() => handleUserType("Patient")}
                className={`p-2 rounded-md w-1/2 text-center ${
                  userType === "Patient"
                    ? "bg-blue-500 text-white"
                    : "border-2 border-blue-500 text-blue-500"
                }`}
              >
                Patient Login
              </button>
              <button
                onClick={() => handleUserType("Doctor")}
                className={`p-2 rounded-md w-1/2 text-center ${
                  userType === "Doctor"
                    ? "bg-blue-500 text-white"
                    : "border-2 border-blue-500 text-blue-500"
                }`}
              >
                Doctor Login
              </button>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-lg font-medium">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  required
                  placeholder="Enter your email"
                  className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="text-lg font-medium">Password</label>
                <input
                  value={password}
                  minLength="6"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Enter your password"
                  className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div
                className={`${
                  responseCode === 200 ? "text-green-500" : "text-red-500"
                }`}
              >
                {responseMessage}
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
              >
                Login as {userType}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
