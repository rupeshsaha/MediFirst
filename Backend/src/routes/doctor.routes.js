import {Router} from "express"
import { protectRoute } from "../middlewares/auth.middleware.js"
import { findDoctor, getDoctorAppointments, loginDoctor, registerDoctor} from "../controllers/doctor.controller.js"

const router = Router()

router.post("/register",registerDoctor)
router.post("/login",loginDoctor)
router.get("/appointment", protectRoute, getDoctorAppointments)
router.get("/find",  findDoctor)


export default router

