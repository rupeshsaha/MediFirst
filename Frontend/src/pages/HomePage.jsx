import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import searchIcon from "../assets/magnifying-glass.svg";
import PrimaryCare from "../assets/primary-care.svg";
import Dentist from "../assets/dentist.svg";
import Dermat from "../assets/dermat.svg";
import Psychiatrist from "../assets/psychiatrist.svg";
import eye from "../assets/eye.svg";
import obgyn from "../assets/obgyn.svg";
import specialisation from "../assets/specialisation.svg";
import book from "../assets/book.svg";
import reviews from "../assets/reviews.svg";
import { StoreContext } from "../store/StoreContext";
import Paginate from "../components/Paginate";

const HomePage = () => {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [search, setSearch] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [totalDoctors, setTotalDoctors] = useState(0)

  const { currPage, setTotalPages } = useContext(StoreContext);

  const [topSpecialities, setTopSpeciality] = useState([
    {
      title: "Primary Care",
      img: PrimaryCare,
    },
    {
      title: "Dentist",
      img: Dentist,
    },
    {
      title: "Dermatologist",
      img: Dermat,
    },
    {
      title: "Psychiatrist",
      img: Psychiatrist,
    },
    {
      title: "Eye Doctor",
      img: eye,
    },
    {
      title: "OB-GYN",
      img: obgyn,
    },
  ]);

  useEffect(() => {
    try {
      const submitHandler = async () => {
        const response = await fetch(
          `${
            import.meta.env.VITE_SERVER_URL
          }/doctor/find?query=${query}&location=${location}&page=${currPage}&limit=12`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();
        if (response.status === 200) {
          setDoctors(data.availableDoctors);
          setTotalDoctors(data.totalDoctors)
        }
        setTotalPages(data.totalPages);
      };
      submitHandler();
    } catch (error) {
      alert(`Error ${response.message}`);
      console.error(`Error while finding doctors : ${error}`);
    }
  }, [currPage, search]);

  return (
    <>
      {/* Header and Search */}
      <div className="bg-[#e0ebfd7d] flex flex-col justify-center items-start border-b-2 md:gap-6 gap-2 md:p-12 p-3">
        <h1 className="text-xl sm:text-3xl md:text-5xl font-bold text-center">
          Find the best <span className="text-blue-600">Doctors</span> Here
        </h1>
        <h1 className="text-lg sm:text-2xl md:text-3xl font-semibold text-center">
          and book appointments with <span className="text-blue-600">ease</span>
        </h1>

        {/* Search Bar */}
        <div className="bg-white md:w-[90%] w-full   rounded-md shadow-md flex items-center ">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Doctor, specialization, condition..."
            className="w-full md:h-auto  p-2 md:text-lg text-sm text-gray-700 focus:outline-none"
          />
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            type="text"
            placeholder="Locality, city, state..."
            className="w-full md:h-auto  p-2 md:text-lg text-sm text-gray-700 focus:outline-none border-l-2"
          />
          <button
            onClick={setSearch}
            className="bg-blue-600 text-white px-4 py-2  rounded-r-md hover:bg-blue-700 transition duration-300"
          >
            <img src={searchIcon} className="size-8 font-bold " alt="" />
          </button>
        </div>
      </div>

      {/* Search Results */}

      <div className="bg-[#e0ebfd7d] md:p-6 p-3 flex flex-col gap-2 ">
        {search ? (
          <h2 className="text-xl font-medium">
            Search Results -
            {doctors?.length >0 &&
            (<span className="pl-3 font-normal text-lg">
              {totalDoctors} doctor{doctors?.length > 1 ? "s" : ""} found
            </span>)}
          </h2>
        ) : (
          <h1 className="text-xl font-medium">Top Doctors</h1>
        )}
        <div className=" md:p-3 grid lg:grid-cols-6 md:grid-cols-3 grid-cols-1  gap-3 ">
          {doctors?.length > 0 ? (
            doctors.map((doctor, index) => (
              <div
                key={index}
                className="bg-white rounded-md shadow-md p-6 text-center flex flex-col hover:border hover:border-blue-500 duration-300 gap-2 border border-gray-200 "
              >
                <h1 className="md:text-lg text-2xl font-semibold text-blue-600">
                  {doctor.name}
                </h1>

                <div className="text-sm text-gray-600">
                  <span className="font-medium text-gray-800">
                    Specialization:{" "}
                  </span>
                  {doctor.specialization}
                </div>

                <div className="text-sm text-gray-600">
                  <span className="font-medium text-gray-800">
                    Experience:{" "}
                  </span>
                  {doctor.experience || 0}{" "}
                  {doctor.experience > 1 ? "years" : "year"}
                </div>

                <div className="text-sm text-gray-600">
                  <span className="font-medium text-gray-800">Location: </span>
                  {doctor.location}
                </div>

                <div className="text-sm text-gray-600">
                  <span className="font-medium text-gray-800">
                    Consultation Fee:{" "}
                  </span>
                  ₹ {doctor.consultationFee}
                </div>

                <Link
                  to={`/book-appointment?doctorId=${encodeURIComponent(
                    doctor._id
                  )}`}
                >
                  <button className="mt-4 w-full bg-blue-500 text-white py-2 md:py-1 px-3 rounded-md hover:bg-blue-700 transition duration-300">
                    Book Appointment
                  </button>
                </Link>
              </div>
            ))
          ) : (
            <div>No Doctors Found</div>
          )}
        </div>
        <Paginate />
      </div>

      {/* Top Specialities */}
      <div className="md:p-6  p-3  flex flex-col gap-2">
        <h2 className="text-2xl font-medium">Top Searched Specialties</h2>
        <div className=" grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 justify-around text-black font-medium p-4 lg:p-16">
          {topSpecialities.map((speciality, index) => (
            <div
              onClick={() => {
                setQuery(speciality.title);
                setSearch(true);
              }}
              key={index}
              className="rounded-md md:p-8 p-4 hover:scale-105 duration-200 bg-opacity-70 hover:bg-blue-50 text-center flex flex-col justify-center items-center  border-blue-500 border-2"
            >
              <img
                src={speciality.img}
                alt={speciality.title}
                className="h-16 w-16 mx-auto mb-2"
              />
              <p>{speciality.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Extras */}
      <div className="flex flex-col items-center md:p-8 py-4 gap-4 bg-[#e0ebfd7d]">
        <div className="text-2xl md:text-3xl font-semibold text-center px-4">
          Let’s get you a doc who gets you
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8  md:p-8 p-4 w-full max-w-7xl">
          <div className="bg-white rounded-md shadow-md flex flex-col items-center text-center p-6 hover:border hover:scale-110 duration-200 hover:border-blue-500">
            <img
              src={specialisation}
              className="w-20 h-20 md:w-32 md:h-32 lg:w-40 lg:h-40 -mt-12 mb-4 object-contain"
              alt="Specialization"
            />
            <p className="text-lg font-medium">Browse by Specialty</p>
          </div>

          <div className="bg-white rounded-md shadow-md flex flex-col items-center text-center p-6 hover:border hover:scale-110 duration-200 hover:border-blue-500">
            <img
              src={reviews}
              className="w-20 h-20 md:w-32 md:h-32 lg:w-40 lg:h-40 -mt-12 mb-4 object-contain"
              alt="Reviews"
            />
            <p className="text-lg font-medium">Read Reviews from Users</p>
          </div>

          <div className="bg-white rounded-md shadow-md flex flex-col items-center text-center p-6 hover:border hover:scale-110 duration-200 hover:border-blue-500">
            <img
              src={book}
              className="w-20 h-20 md:w-32 md:h-32 lg:w-40 lg:h-40 -mt-12 mb-4 object-contain"
              alt="Book Appointment"
            />
            <p className="text-lg font-medium">
              Book an Appointment Today, Online
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
