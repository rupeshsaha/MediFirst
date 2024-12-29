import { Patient } from "../models/patient.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt.js";
import { Doctor } from "../models/doctor.model.js";
import { Appointment } from "../models/appointment.model.js";
import mongoose from "mongoose";

const registerPatient = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingEmail = await Patient.findOne({ email: email });

    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const patient = await Patient.create({
      name: name.trim(),
      email: email.trim(),
      password: hashedPassword,
    });

    const createdPatient = await Patient.findById(patient._id).select(
      "-password"
    );

    if (!createdPatient) {
      return res
        .status(500)
        .json({ message: "Error while registering patient" });
    }

    res
      .status(201)
      .json({
        message: "Patient Registered Successfully",
        patient: createdPatient,
      });
  } catch (error) {
    console.error("Error in register Patient:", error.message);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const loginPatient = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const patient = await Patient.findOne({ email: email });

    if (!patient) {
      return res.status(400).json({ message: "Incorrect Email or Password" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, patient.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Incorrect Email or Password" });
    }

    const loggedInUser = await Patient.findById(patient._id).select(
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
    console.error("Error in login Patient:", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};


const createAppointment = async (req, res) => {
  try {
      const {doctorId} = req.query
      let discountApplied = 0
      const { appointmentDateAndTime, notes } = req.body
      const patientId = req.user?._id
  
      if(!appointmentDateAndTime){
          return res.status(400).json({message: "Enter a valid appointment date"})
      }
  
      const doctor = await Doctor.findById(doctorId)
  
      if(!doctor){
          return res.status(400).json({message: "Invalid Doctor Id"})
      }
  
      const fee = doctor.consultationFee
  
      const isNotFirstTime = await Appointment.findOne({
          patientId: patientId,
          doctorId: doctorId
      })
  
      if(!isNotFirstTime){
       discountApplied = 0.5*fee;
      }

     const finalFee = fee - discountApplied 
      const createdAppointment = await Appointment.create({
          patientId,
          doctorId,
          appointmentDateAndTime,
          isFirstTime: !isNotFirstTime,
          fee,
          discountApplied,
          finalFee,
          notes : notes?.trim()
      })
  
      if(!createAppointment){
          return res.status(500).json({message : "Error while creating appointment"})
      }
  
      res.status(200).json({message: "Appointment Created Successfully", createdAppointment})
  } catch (error) {
    console.error("Error in creating appointment:", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }

}

const getPatientAppointments = async (req, res) => {
   try {
     const patientId = req.user?._id;
     const {
      appointmentId,
      page = 1,
      limit = 12
    } = req.query;

    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    const filter = {};

    if(appointmentId)
      filter._id = new mongoose.Types.ObjectId(appointmentId)

    filter.patientId = new mongoose.Types.ObjectId(patientId)  
 
     const appointments = await Appointment.find(filter)
     .skip(skip)
     .limit(limit)
     .populate("doctorId")
     .select(" -password ")
     .sort({createdAt : -1})
   

     const totalAppointments= await Appointment.countDocuments(filter);
     const totalPages = Math.ceil(totalAppointments / limitNumber);
 
     if(appointments.length === 0){
         return res.status(200).json({message: "No appointments found"})
     }
 
     res.status(200).json({message: "Appointments found successfully", appointments, totalAppointments, totalPages})
   } catch (error) {
    console.error("Error in fetching appointments:", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
   }
}





export { registerPatient, loginPatient, createAppointment, getPatientAppointments};
