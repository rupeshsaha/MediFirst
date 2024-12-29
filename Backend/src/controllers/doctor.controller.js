import bcrypt from "bcryptjs"
import { Doctor } from "../models/doctor.model.js";
import { generateToken } from "../utils/jwt.js";
import { Appointment } from "../models/appointment.model.js";
import mongoose from "mongoose";

const registerDoctor = async (req, res) => {
  try {
    const { name, email, password, specialization, consultationFee, location, experience, about } = req.body;

    if(consultationFee<=0){
        return res.status(400).json({message: "Consultation fee must be greater than 0"})
    }

    if (!name?.trim() || !email?.trim() || !password?.trim() || !specialization?.trim()) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingEmail = await Doctor.findOne({ email: email });

    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const patient = await Doctor.create({
      name: name.trim(),
      email: email.trim(),
      password: hashedPassword,
      specialization,
      consultationFee,
      location: location?.trim(),
      experience,
      about: about?.trim()
    });

    const createdDoctor = await Doctor.findById(patient._id).select(
      "-password"
    );

    if (!createdDoctor) {
      return res
        .status(500)
        .json({ message: "Error while registering patient" });
    }

    res
      .status(201)
      .json({
        message: "Doctor Registered Successfully",
        doctor: createdDoctor,
      });
  } catch (error) {
    console.error("Error in register Doctor:", error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const doctor = await Doctor.findOne({ email: email });

    if (!doctor) {
      return res.status(400).json({ message: "Incorrect Email or Password" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, doctor.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Incorrect Email or Password" });
    }

    const loggedInUser = await Doctor.findById(doctor._id).select(
      "-password"
    );


    if (!loggedInUser) {
      return res.status(500).json({ message: "Error While Login" });
    }
    
    generateToken(loggedInUser._id, res);

    return res
      .status(200)
      .json({ message: "Logged in successfully", loggedInUser });
  } catch (error) {
    console.error("Error in login Doctor:", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};


const getDoctorAppointments = async (req, res) => {
try {
    const {
      page = 1,
      limit = 12
    } = req.query;

    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    const appointments = await Appointment.find({
      doctorId: req.user?._id
    }).populate("patientId")
    .select(" -password ")
    .limit(limitNumber)
    .skip(skip)
    .sort({createdAt : -1})

    const totalAppointments= await Appointment.countDocuments({doctorId: req.user?._id});
    const totalPages = Math.ceil(totalAppointments / limitNumber);
  
    if(!appointments){
      return res.status(200).json({message: "No appointments found"})
    }
  
    return res.status(200).json({message: "Appointments fetched successfully", appointments, totalAppointments, totalPages})
} catch (error) {
  console.error("Error in get doctor appointments :", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message })
}
}

const findDoctor = async (req, res) => {
try{
  const {
    id = '',
    query = '',
    location = '',
    page = 1,
    limit = 12,
  } = req.query;

  const filter = {};

  if (query) 
    filter.$or = [
      { name: { $regex: query, $options: 'i' } },
      { specialization: { $regex: query, $options: 'i' } },
    ];
   
    if(location)
      filter.location = { $regex: location, $options: 'i' }

    if(id)
      filter._id = new mongoose.Types.ObjectId(id)

  const pageNumber = parseInt(page, 10) || 1;
  const limitNumber = parseInt(limit, 10) || 10;
  const skip = (pageNumber - 1) * limitNumber;

  const availableDoctors = await Doctor.find(filter)
    .skip(skip)
    .limit(limitNumber)
    .select("-password")
    .sort({experience: -1})

  const totalDoctors= await Doctor.countDocuments(filter);
  const totalPages = Math.ceil(totalDoctors / limitNumber);

  if (availableDoctors.length === 0) {
    return res.status(200).json({ message: " No Doctors Available " });
  }

  res.status(200).json({
    availableDoctors,
    currentPage: pageNumber,
    totalPages,
    totalDoctors,
  });
} catch (error) {
  console.error("Error fetching doctors:", error);
  res.status(500).json({ message: "An error occurred while fetching doctors" });
}
};


export {
    registerDoctor,
    loginDoctor,
    getDoctorAppointments,
    findDoctor
}