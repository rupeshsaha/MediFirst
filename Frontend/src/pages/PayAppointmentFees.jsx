import React, { useContext, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { convertDateToLocal } from "../lib/ConvertDateToLocal";
import { convertTimeToLocal } from "../lib/ConvertTimeToLocal";
import { StoreContext } from "../store/StoreContext";

const PayAppointmentFees = () => {
  const [searchParams] = useSearchParams();
  const [appointmentId, setAppointmentId] = useState("");
  const [isFeeAlreadyPaid, setIsFeeAlreadyPaid] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);

  const { setBalance } = useContext(StoreContext);

  const [appointmentDetails, setAppointmentDetails] = useState({
    doctorName: "",
    appointmentDate: "",
    appointmentTime: "",
    consultationFee: 0,
    discount: 0,
    finalFee: 0,
  });

  useEffect(() => {
    const id = searchParams.get("appointmentId");
    if (id) {
      setAppointmentId(id);
    }
  }, [searchParams]);

  useEffect(() => {
    const getAppointmentDetails = async () => {
      if (!appointmentId) return;

      setIsLoading(true);

      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_SERVER_URL
          }/patient/appointment?appointmentId=${appointmentId}`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch appointment details");
        }

        const data = await response.json();
        setIsFeeAlreadyPaid(data.appointments[0].paymentStatus !== "Pending");

        setAppointmentDetails({
          doctorName: data.appointments[0].doctorId.name || "N/A",
          appointmentDate:
            convertDateToLocal(data.appointments[0].appointmentDateAndTime) ||
            "N/A",
          appointmentTime:
            convertTimeToLocal(data.appointments[0].appointmentDateAndTime) ||
            "N/A",
          consultationFee: data.appointments[0].fee || 0,
          discount: data.appointments[0].discountApplied || 0,
          finalFee: data.appointments[0].finalFee || 0,
        });
      } catch (error) {
        console.error("Error fetching appointment details:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    getAppointmentDetails();
  }, [appointmentId]);

  const createTransaction = async () => {
    setIsPaying(true);

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_SERVER_URL
        }/transaction/create?appointmentId=${appointmentId}`,
        {
          method: "POST",
          credentials: "include",
        }
      );
      const data = await response.json();
      if (response.status === 200) {
        setIsFeeAlreadyPaid(true);
        setPaymentSuccess(true);
        setBalance(data.updatedBalance.patientBalance);
      }
      if (response.status >= 400 && response.status <= 600)
        alert(`${data.message}`);
    } catch (error) {
      console.error("Error while Creating Transaction", error);
      alert(`${error.message}`);
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="bg-[#e0ebfd7d]  flex justify-center items-center p-4">
      {isLoading ? (
        <div className="flex justify-center items-center">
          <div className="loader border-4 border-blue-500 border-t-transparent rounded-full w-12 h-12 animate-spin"></div>
          <p className="ml-4 text-lg font-medium">
            Loading appointment details...
          </p>
        </div>
      ) : (
        <>
          {/* Payment Form */}
          {!isFeeAlreadyPaid && !paymentSuccess ? (
            <div className="bg-white rounded-lg flex flex-col text-gray-800 shadow-xl p-8">
              <h1 className="text-3xl font-bold mb-5 text-center text-gray-900">
                Pay Appointment Fees
              </h1>
              <div className="space-y-2 mb-6">
                <div className="flex justify-between">
                  <span className="font-medium">Doctor's Name:</span>
                  <span>{appointmentDetails.doctorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Appointment Date:</span>
                  <span>{appointmentDetails.appointmentDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Appointment Time:</span>
                  <span>{appointmentDetails.appointmentTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Consultation Fee:</span>
                  <span> ₹ {appointmentDetails.consultationFee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Discount:</span>
                  <span> ₹ {appointmentDetails.discount}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Final Fee:</span>
                  <span> ₹ {appointmentDetails.finalFee}</span>
                </div>
              </div>
              <button
                onClick={createTransaction}
                disabled={isPaying}
                className={`py-2 px-4 ${
                  isPaying ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                } text-white font-medium rounded-md transition duration-200`}
              >
                {isPaying ? "Processing Payment..." : "Pay Now"}
              </button>
            </div>
          ) : paymentSuccess ? (
            <div className="text-green-700 flex flex-col justify-start h-screen pt-20 items-center text-2xl font-semibold">
              ✅ Payment Success
              <Link to="/">
                <button className="py-2 px-4 text-base bg-blue-600 hover:bg-blue-700 text-white  font-medium rounded-md mt-4 transition duration-200">
                  Go To Home
                </button>
              </Link>
            </div>
          ) : (
            <div className="text-green-700 flex flex-col justify-start  h-screen items-center pt-20 text-2xl font-semibold">
              ✅ You have already paid for this appointment
              <Link to="/">
                <button className="py-2 px-4 text-base bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md mt-4 transition duration-200">
                  Go To Home
                </button>
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PayAppointmentFees;
