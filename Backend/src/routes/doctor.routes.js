import {Router} from "express"
import { protectRoute } from "../middlewares/auth.middleware.js"
import { findDoctor, getDoctorAppointments, loginDoctor, registerDoctor, updateDoctorDetails } from "../controllers/doctor.controller.js"

const router = Router()

router.post("/register",registerDoctor)
router.post("/login",loginDoctor)
router.patch("/update", protectRoute, updateDoctorDetails)
router.get("/appointment", protectRoute, getDoctorAppointments)
router.get("/find",  findDoctor)


export default router

