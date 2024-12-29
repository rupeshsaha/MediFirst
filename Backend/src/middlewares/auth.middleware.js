import jwt from "jsonwebtoken"
import {Patient} from "../models/patient.model.js"
import {Doctor} from "../models/doctor.model.js"

export const protectRoute = async(req, res, next) => {
    try {
        const token= req.cookies?.token;

        if(!token){
            return res.status(401).json({ message: "Unauthorized - No token provided"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if(!decoded){
            return res.status(401).json({message: "Unauthorized: Invalid token"})
        }

        const user = await Patient.findById(decoded.userId).select("-password") || await Doctor.findById(decoded.userId).select("-password")

        if(!user){
          return res.status(404).json({message: "User not Found"})  
        }

        req.user = user
        next();
    } catch (error) {
        console.log("Error in protectRoute Middleware :", error)
        }}
