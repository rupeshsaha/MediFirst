import React, { useContext, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import RegisterDoctor from "./pages/RegisterDoctor";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BookAppointment from "./pages/BookAppointment";
import { StoreContext } from "./store/StoreContext";
import Login from "./components/Login";
import PayAppointmentFees from "./pages/PayAppointmentFees";
import Appointments from "./pages/Appointments";
import Transactions from "./pages/Transactions";

const App = () => {
  const { loggedInUserType, setLoggedInUserType, setBalance, setName } =
    useContext(StoreContext);

  useEffect(() => {
    try {
      const checkAuth = async () => {
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/auth`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();
        if (response.status === 200) {
          setLoggedInUserType(data.userType);
          console.log(data.doctor.name);
          
          setName(data.patient?.name || data.doctor?.name)
          setBalance(data.patient?.walletBalance || data.doctor?.totalEarnings);
        }
      };
      checkAuth();
    } catch (error) {
      console.error("Error while checking auth", error);
    }
  }, [setLoggedInUserType, setBalance]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register-doctor" element={<RegisterDoctor />} />
        <Route
          path="/book-appointment"
          element={
            loggedInUserType == "Patient" ? (
              <BookAppointment />
            ) : (
              <Login defaultIsOpen={true} />
            )
          }
        />
        <Route
          path="/pay-fees"
          element={
            loggedInUserType == "Patient" ? (
              <PayAppointmentFees />
            ) : (
              <Login defaultIsOpen={true} />
            )
          }
        />
        <Route
          path="/appointments"
          element={
            loggedInUserType == "Patient" || loggedInUserType == "Doctor" ? (
              <Appointments />
            ) : (
              <Login defaultIsOpen={true} />
            )
          }
        />
        <Route
          path="/transactions"
          element={
            loggedInUserType == "Patient" || loggedInUserType == "Doctor" ? (
              <Transactions />
            ) : (
              <Login defaultIsOpen={true} />
            )
          }
        />
      </Routes>
      <Footer />
    </>
  );
};

export default App;
