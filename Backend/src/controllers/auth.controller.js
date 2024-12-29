import { Doctor } from "../models/doctor.model.js";
import { Patient } from "../models/patient.model.js";

export const getLoggedInUser = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "User is not logged in" });
    }

    const doctor = await Doctor.findById(userId).select("-password");
    if (doctor) {
      return res.status(200).json({ userType: "Doctor", doctor });
    }

    const patient = await Patient.findById(userId).select("-password");
    if (patient) {
      return res.status(200).json({ userType: "Patient", patient });
    }

    return res.status(404).json({ message: "User not found" });
  } catch (error) {
    console.error("Error in getting logged-in user:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = async (req, res) => {
    try {
        res.cookie("token", "", {maxAge: 0})
        res.status(200).json({message: "Logged out successfully"})
    } catch (error) {
        console.log("Error in logout controller", error);
        res.status(500).json({message: "Internal Server Error"})
    }
  }
