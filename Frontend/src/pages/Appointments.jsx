import React, { useContext, useEffect, useState } from "react";
import { convertDateToLocal } from "../lib/ConvertDateToLocal";
import { convertTimeToLocal } from "../lib/ConvertTimeToLocal";
import { Link } from "react-router-dom";
import { StoreContext } from "../store/StoreContext";
import Paginate from "../components/Paginate";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const { loggedInUserType, currPage, setTotalPages } = useContext(StoreContext);

  useEffect(() => {
    const getAppointments = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_SERVER_URL
          }/${loggedInUserType.toLowerCase()}/appointment?page=${currPage}&limit=12`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        
        
        const data = await response.json();
        
        if (response.status === 200) {
        setTotalPages(data.totalPages)
          setAppointments(data.appointments);
        } else {
          alert(`${data.message}`);
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (loggedInUserType) {
      getAppointments();
    }
  }, [loggedInUserType, currPage]);

  return (
    <div className="bg-[#e0ebfd7d] w-full p-4 md:p-8">
      {appointments?.length > 0 ? (
        <>
          <div className="text-xl md:text-3xl font-bold mb-4 md:mb-8">
            Your Appointments
          </div>

          {/* Header Row */}
          <div className="hidden md:grid grid-cols-5 font-semibold text-lg mb-4">
            <div>
              {loggedInUserType === "Patient"
                ? "Doctor"
                : loggedInUserType === "Doctor"
                ? "Patient"
                : "N/A"}
            </div>
            <div>Booked At</div>
            <div>Appointment Date</div>
            <div>Appointment Time</div>
            <div>Payment Status</div>
          </div>

          {/* Appointment Cards */}
          <div className="flex flex-col gap-4">
            {appointments.map((appointment) => (
              <div
                key={appointment._id}
                className="bg-white rounded-md shadow-md text-gray-800 p-4 md:grid md:grid-cols-5 flex flex-col gap-2 md:gap-4"
              >
                {/* Doctor/Patient Name */}
                <div>
                  <span className="font-medium md:hidden">Name: </span>
                  {appointment?.patientId?.name ||
                    appointment?.doctorId?.name ||
                    "N/A"}
                </div>

                {/* Booked At */}
                <div>
                  <span className="font-medium md:hidden">Booked At: </span>
                  {`${convertDateToLocal(
                    appointment.createdAt
                  )} ${convertTimeToLocal(appointment.createdAt)}`}
                </div>

                {/* Appointment Date */}
                <div>
                  <span className="font-medium md:hidden">Date: </span>
                  {convertDateToLocal(appointment.appointmentDateAndTime)}
                </div>

                {/* Appointment Time */}
                <div>
                  <span className="font-medium md:hidden">Time: </span>
                  {convertTimeToLocal(appointment.appointmentDateAndTime)}
                </div>

                {/* Payment Status */}
                <div
                  className={`${
                    appointment.paymentStatus === "Pending"
                      ? "text-yellow-600"
                      : "text-green-500"
                  } flex items-center justify-between gap-2`}
                >
                  <div>
                    <span className="font-medium md:hidden">Payment: </span>
                    {appointment.paymentStatus}
                  </div>

                  {appointment.paymentStatus === "Pending" &&
                    loggedInUserType === "Patient" && (
                      <Link
                        to={`/pay-fees?appointmentId=${encodeURIComponent(
                          appointment._id
                        )}`}
                      >
                        <div className="bg-blue-500 rounded-md px-2 py-1 text-white text-center text-sm hover:bg-blue-700 duration-300">
                          Pay Now
                        </div>
                      </Link>
                    )}

                  {loggedInUserType === "Doctor" && (
                    <div className="bg-blue-500 rounded-md px-2 py-1 text-white text-center text-sm hover:bg-blue-700 duration-300">
                      View Details
                    </div>
                  )}
                </div>
               
              </div>
           
            ))}
          </div>
        </>
      ) : (
        <div className="text-center text-gray-600 mt-8">
          You do not have any appointments.
        </div>
      )} 
      <Paginate/>
    </div>
  );
};

export default Appointments;
