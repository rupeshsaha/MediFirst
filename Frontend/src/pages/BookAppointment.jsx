import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

const BookAppointment = () => {
  const [formData, setFormData] = useState({
    appointmentDate: "",
    appointmentTime: "",
    notes: "",
  });

  const [appointmentId, setAppointmentId] = useState("");

  const [searchParams] = useSearchParams();
  const doctorId = searchParams.get("doctorId");

  const [doctorDetails, setDoctorDetails] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(false);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Fetch Doctor Details
  useEffect(() => {
    const getDoctorDetails = async () => {
      if (doctorId) {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_SERVER_URL}/doctor/find?id=${doctorId}`,
            {
              method: "GET",
              credentials: "include",
            }
          );
          const data = await response.json();
          setDoctorDetails(data.availableDoctors[0]);
        } catch (error) {
          console.error("Error fetching doctor details:", error);
        }
      }
    };
    getDoctorDetails();
  }, [doctorId]);

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Combine Date and Time into a single ISO date string
    const combinedDateTime = new Date(
      `${formData.appointmentDate}T${formData.appointmentTime}`
    );

    const appointmentData = {
      appointmentDateAndTime: combinedDateTime,
      notes: formData.notes,
    };

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_SERVER_URL
        }/patient/appointment?doctorId=${doctorId}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(appointmentData),
        }
      );

      const data = await response.json();
      if (response.status === 200) {
        setIsFirstTime(data.createdAppointment.isFirstTime);
        setIsSubmitted(true);
        setAppointmentId(data.createdAppointment._id);
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
    }
  };

  return (
    <div className="bg-[#e0ebfd7d] md:p-12 p-2 flex md:flex-row flex-col justify-center min-h-screen">
      {doctorDetails ? (
        <div className="mb-6 w-full   flex flex-col items-center">
          <div className="text-gray-700 ">
            <h2 className="text-4xl font-semibold mb-4 text-center">
              {doctorDetails.name}
            </h2>
            <div className="flex">
              <p className="text-lg border-r-2 px-2">
                {doctorDetails.specialization}
              </p>
              <p className="text-lg border-r-2 px-2">
                {doctorDetails.location}
              </p>
              <p className="text-lg px-2">{doctorDetails.about}</p>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading doctor details...</p>
      )}

      <div className="w-full mx-auto bg-white duration-300 p-6 rounded-lg shadow-md md:h-[50%]">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
          Book an Appointment
        </h1>

        {isSubmitted ? (
          <div>
            <div className="text-green-600 text-center text-xl font-medium">
              ✅ Your appointment has been successfully booked!
              {isFirstTime && (
                <div>
                  🎉 Hurray! You got a flat 50% off on consultation fee.
                </div>
              )}
            </div>

            <div className="w-full flex gap-2 justify-center p-2 pt-8">
              <Link to="/">
                <div className="rounded-md border-blue-500 border-2 text-blue-500 py-2 px-3 hover:bg-blue-500 hover:text-white duration-300">
                  Go To Home
                </div>
              </Link>

              <Link
                to={`/pay-fees?appointmentId=${encodeURIComponent(
                  appointmentId
                )}`}
              >
                <div className="rounded-md bg-blue-500 text-white px-3 py-2 hover:bg-blue-600 duration-300">
                  Pay Fee
                </div>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Date */}
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Appointment Date
              </label>
              <input
                type="date"
                name="appointmentDate"
                value={formData.appointmentDate}
                onChange={handleChange}
                required
                className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Time */}
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Appointment Time
              </label>
              <input
                type="time"
                name="appointmentTime"
                value={formData.appointmentTime}
                onChange={handleChange}
                required
                className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-lg font-medium text-gray-700">
                Additional Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Add any specific concerns or requests"
                rows="3"
                className="w-full mt-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300"
            >
              Confirm Appointment
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default BookAppointment;
