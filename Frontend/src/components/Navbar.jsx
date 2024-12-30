import React, { useContext, useState } from "react";
import Login from "./Login";
import Signup from "./Signup";
import { Link } from "react-router-dom";
import { StoreContext } from "../store/StoreContext";
import menuIcon from "../assets/menu.svg";
import closeIcon from "../assets/close.svg";
import pfp from "../assets/pfp.svg";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState("");

  const { loggedInUserType, setLoggedInUserType, balance, setBalance, name } =
    useContext(StoreContext);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
  };

  const openRechargeModal = () => {
    setShowRechargeModal(true);
  };

  const closeRechargeModal = () => {
    setShowRechargeModal(false);
    setRechargeAmount(""); // Clear input on close
  };

  const handleRecharge = async () => {
    if (!rechargeAmount || isNaN(rechargeAmount) || rechargeAmount <= 0) {
      alert("Please enter a valid recharge amount.");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/transaction/recharge`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount: rechargeAmount }),
        }
      );

      const data = await response.json();

      if (response.status === 200) {
        setBalance((prev) => prev + parseFloat(rechargeAmount));
        alert("Recharge successful!");
        closeRechargeModal();
      } else {
        alert(data.message || "Recharge failed.");
      }
    } catch (error) {
      console.error("Recharge error:", error.message);
      alert("An error occurred during recharge.");
    }
  };

  const logoutHandler = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/auth/logout`,
        {
          credentials: "include",
          method: "POST",
        }
      );
      if (response.status === 200) setLoggedInUserType(null);
    } catch (error) {
      console.error("Error during logout", error.message);
    }
  };

  return (
    <nav className="p-4 w-full flex justify-between items-center bg-white shadow-md relative">
      {/* Logo Section */}
      <Link to="/">
        <h1 className="font-bold text-2xl text-blue-600">MediFirst</h1>
      </Link>

      {/* Desktop View */}
      {!loggedInUserType && (
        <div className="gap-4 md:flex hidden">
          <Link to="/register-doctor">
            <div className="text-gray-700 font-medium p-2">
              List your practice on{" "}
              <span className="text-blue-500">MediFirst</span>
            </div>
          </Link>
          <Login />
          <Signup />
        </div>
      )}

      {(loggedInUserType === "Patient" || loggedInUserType === "Doctor") && (
        <div className="md:flex hidden items-center gap-6">
          <div className="text-gray-700 font-bold flex items-center gap-2">
            <img src={pfp} className="size-5 mt-1" alt="Profile" />
            {`${name}`}
          </div>
          {/* Balance Section */}
          <div className="text-gray-700 font-medium flex items-center justify-center gap-2">
            Balance:{" "}
            <span className="font-semibold text-green-600 flex items-center justify-center">
              ₹ {balance}
              {loggedInUserType === "Patient" && (
                  <span
                  onClick={openRechargeModal}
                  className="ml-2 cursor-pointer flex items-center justify-center w-6 h-6 rounded-full text-white bg-green-500 text-lg font-bold"
                >
                  +
                </span>
              )}
            
            </span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <Link to="/appointments">
              <div className="hover:text-blue-600 transition-colors cursor-pointer">
                Your Appointments
              </div>
            </Link>
            <Link to="/transactions">
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
        <button onClick={toggleMenu}>
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
            onClick={toggleMenu}
            className="absolute top-4 right-4 hover:bg-gray-200 rounded-full p-2 transition duration-200"
          >
            <img src={closeIcon} className="w-6 h-6" alt="Close Menu" />
          </button>

          {loggedInUserType ? (
            <>
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={pfp}
                    className="w-10 h-10 rounded-full border border-gray-300 shadow-md"
                    alt="Profile"
                  />
                  <div>
                    <h2 className="text-gray-800 font-bold text-2xl">{name}</h2>
                    <p className="text-gray-600 font-medium">
                      Balance:
                      {loggedInUserType === "Patient" ? (
                         <span
                         onClick={openRechargeModal}
                         className="text-green-600 font-bold"
                       >
                         {" "}
                         ₹ {balance}  +
                       </span>
                      ): (
                        <span
                        className="text-green-600 font-bold"
                      >
                        {" "}
                        ₹ {balance} 
                      </span>
                      )
                      }
                    
                     
                    </p>
                  </div>
                </div>
              </div>

              <nav className="flex flex-col items-center gap-4 mt-6 w-full">
                <Link
                  to="/appointments"
                  onClick={toggleMenu}
                  className="w-full text-center py-2 text-lg font-medium text-blue-600"
                >
                  Your Appointments
                </Link>
                <Link
                  to="/transactions"
                  onClick={toggleMenu}
                  className="w-full text-center py-2 text-lg font-medium text-blue-600"
                >
                  Your Payments
                </Link>
              </nav>

              <button
                onClick={() => {
                  logoutHandler();
                  toggleMenu();
                }}
                className="w-full text-center py-2 text-lg font-medium text-red-500"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="w-full flex flex-col items-center gap-6 mt-8">
              <Login />
              <Signup />
            </div>
          )}
        </div>
      )}

      {/* Recharge Modal */}
      {showRechargeModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-bold mb-4">Recharge Wallet</h2>
            <input
              type="number"
              value={rechargeAmount}
              onChange={(e) => setRechargeAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full p-2 border rounded-md mb-4"
            />
            <div className="flex justify-between">
              <button
                className="bg-white border-red-400 border-2 rounded-md px-3 py-2 text-red-500"
                onClick={closeRechargeModal}
              >
                Cancel
              </button>

              <button
                className="bg-green-700 rounded-md px-3 py-2 text-white"
                onClick={handleRecharge}
              >
                Recharge
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
