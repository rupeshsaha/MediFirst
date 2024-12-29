import React, { useContext, useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import { Link } from "react-router-dom";
import { StoreContext } from "../store/StoreContext";
import menuIcon from "../assets/menu.svg";
import closeIcon from "../assets/close.svg"; 
import pfp from "../assets/pfp.svg"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const togglePopup = () => {
    setIsOpen((prev) => !prev);
  };

  const { loggedInUserType, setLoggedInUserType, balance, name } =
    useContext(StoreContext);

  const logoutHandler = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/auth/logout`,
        {
          credentials: "include",
          method: "POST",
        }
      );
      const data = await response.json();
      if (response.status === 200) setLoggedInUserType(null);
    } catch (error) {
      console.error("Error occurred while logout", error.message);
    }
  };

  return (
    <nav className="p-4 w-full flex justify-between items-center bg-white shadow-md">
      {/* Logo Section */}
      <Link to="/">
        <h1 className="font-bold text-2xl text-blue-600">MediFirst</h1>
      </Link>

      {/* Desktop View */}
      {!loggedInUserType && (
        <div className="gap-4 md:flex hidden">
          
          <Link to="/register-doctor">
            <div className="hidden md:flex text-gray-700 font-medium justify-center items-center p-2">
              List your practice on{" "}
              <span className="text-blue-500 px-1">MediFirst</span>
            </div>
          </Link>
          <Login />
          <Signup />
        </div>
      )}

      {(loggedInUserType === "Patient" || loggedInUserType === "Doctor") && (
        <div className="md:flex hidden items-center justify-between gap-6">

         <div className="text-gray-700 font-bold md:flex hidden  gap-2">
          <img src={pfp} className="size-5 mt-1" alt="" />
          {
         `${name}`}</div>
          {/* Balance */}
          <div className="text-gray-700 font-medium">
            Balance:{" "}
            <span className="font-semibold text-green-600">₹ {balance}</span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link to="/appointments">
              <div className="hover:text-blue-600 transition-colors cursor-pointer">
                Your Appointments
              </div>
            </Link>

           <Link to = "/transactions">
           <div className="hover:text-blue-600 transition-colors cursor-pointer">
              Your Payments
            </div>
            </Link>

            <div
              onClick={logoutHandler}
              className="text-red-500 font-medium hover:text-white hover:bg-red-500 rounded-md cursor-pointer px-3 py-2 duration-300"
            >
              Logout
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Toggle */}
      <div className="md:hidden block">
        <button onClick={togglePopup}>
          <img
            src={isOpen ? closeIcon : menuIcon}
            className="size-7"
            alt="Menu Toggle"
          />
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
  <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-between p-6 shadow-lg overflow-y-auto">

    {/* Close Button */}
    <button
      onClick={togglePopup}
      className="absolute top-4 right-4 hover:bg-gray-200 rounded-full p-2 transition duration-200"
    >
      <img src={closeIcon} className="w-6 h-6" alt="Close Menu" />
    </button>

    {/* User Info Section */}
    {loggedInUserType ? (
      <>
        {/* Profile Section */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
            <img
              src={pfp} 
              className="w-10 h-10 rounded-full border border-gray-300 shadow-md"
              alt="Profile"
            />
            <div>
              <h2 className="text-gray-800 font-bold text-2xl">{name}</h2>
              <p className="text-gray-600 font-medium">Balance: 
                <span className="text-green-600 font-bold"> ₹ {balance}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col items-center gap-4 mt-6 w-full">
          <Link
            to="/appointments"
            onClick={togglePopup}
            className="w-full text-center py-2 text-lg font-medium text-blue-600 hover:bg-blue-100 rounded-md transition"
          >
            Your Appointments
          </Link>
          <Link
            to="/transactions"
            onClick={togglePopup}
            className="w-full text-center py-2 text-lg font-medium text-blue-600 hover:bg-blue-100 rounded-md transition"
          >
            Your Payments
          </Link>
        </nav>

        {/* Logout Button */}
        <div className="mt-8 w-full">
          <button
            onClick={() => {
              logoutHandler();
              togglePopup();
            }}
            className="w-full text-center py-2 text-lg font-medium text-red-500 hover:text-white hover:bg-red-500 rounded-md transition"
          >
            Logout
          </button>
        </div>
      </>
    ) : (
      /* Guest View */
      <div className="w-full flex flex-col items-center gap-6 mt-8">
        <Link
          to="/register-doctor"
          onClick={togglePopup}
          className="text-lg font-medium text-gray-700 hover:underline"
        >
          List your practice on <span className="text-blue-500">MediFirst</span>
        </Link>
        <Login />
        <Signup />
      </div>
    )}
  </div>
)}

    </nav>
  );
};

export default Navbar;
