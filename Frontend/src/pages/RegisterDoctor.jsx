import React, { useState } from "react";
import RocketIcon from "../assets/rocket.png";

const RegisterDoctor = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [location, setLocation] = useState("");
  const [consultationFee, setConsultationFee] = useState("");
  const [experience, setExperience] = useState("");
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const accountDetails = {
      email,
      password,
      name,
      experience,
      location,
      specialization,
      consultationFee,
      about,
    };

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/doctor/register`,
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
      setResponseMessage(data.message);
    } catch (error) {
      console.error("Error while creating account: ", error);
    }
  };

  return (
    <>
      <div className="inset-0 bg-[#e0ebfd] bg-opacity-50 flex md:flex-row flex-col justify-around items-start z-50 p-2 md:p-10 min-h-screen">
        {/* Intro Section */}
        <div className="w-full md:w-1/3 flex flex-col justify-start items-center text-center p-12 rounded-lg ">
          <div>
            <img src={RocketIcon} className="md:size-32 size-20" alt="" />
          </div>

          {/* Header Text */}
          <div className="text-blue-600 text-2xl font-bold py-2 px-4 rounded-md mb-3">
            Let's Get Started
          </div>

          {/* Description Text */}
          <p className="text-gray-600 text-md font-medium leading-relaxed">
            MediFirst is the most efficient way to connect with the right
            patients for your practice. It's easy to join, with no upfront fees
            or subscription costs.
          </p>
        </div>

        {/* Form Section */}
        <div className="bg-white  md:w-2/3 w-full max-w-xl rounded-lg md:p-8 p-4 shadow-lg relative">
          <h2 className="text-2xl font-bold text-center text-blue-500 mb-6">
            Register Your Practice
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                required
                placeholder="Enter your full name"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                placeholder="Enter your email"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Experience */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-1">
                Experience (In Years)
              </label>
              <input
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                type="number"
                required
                placeholder="Enter your experience"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                type="text"
                required
                placeholder="Enter your location"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Specialization */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-1">
                Specialization
              </label>
              <input
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                type="text"
                required
                placeholder="Enter your specialization"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Consultation Fee */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-1">
                Consultation Fee (In INR)
              </label>
              <input
                value={consultationFee}
                onChange={(e) => setConsultationFee(e.target.value)}
                type="number"
                required
                placeholder="Enter your consultation fee"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 mb-1">
                About
              </label>
              <input
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                type="text"
                required
                placeholder="Tell us about yourself"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
                placeholder="Enter your password"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>{responseMessage}</div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition duration-300"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegisterDoctor;
