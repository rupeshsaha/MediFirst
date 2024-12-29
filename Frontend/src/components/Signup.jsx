import React, { useEffect, useState } from "react";

const Signup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const accountDetails = {
      email,
      password,
      name,
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/patient/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(accountDetails),
          credentials: "include",
        }
      );
      const data = await response.json();
    } catch (error) {
      console.error("Error while creating account: ", error);
    }
  };

  return (
    <div>
      <button
        onClick={togglePopup}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 w-full transition duration-300"
      >
        Signup
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white m-2 rounded-md p-6 w-full max-w-md shadow-lg relative">
            <button
              onClick={togglePopup}
              className="absolute top-1 right-2 text-gray-500 hover:text-red-700 "
            >
              ✕
            </button>

            <div className="p-2 text-lg font-semibold flex justify-center mb-2">
              Create Account
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-lg font-medium">Name</label>
                <input
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  type="text"
                  required
                  placeholder="Enter your name"
                  className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-lg font-medium">Email</label>
                <input
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
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
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  type="password"
                  placeholder="Enter your password"
                  className="w-full mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
              >
                Create Account
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;
