import {Router} from "express"
import { loginPatient, registerPatient, createAppointment, getPatientAppointments} from "../controllers/patient.controller.js"
import { protectRoute } from "../middlewares/auth.middleware.js"

const router = Router()

router.post("/register",registerPatient);
router.post("/login",loginPatient);
router.post("/appointment", protectRoute, createAppointment);
router.get("/appointment", protectRoute, getPatientAppointments);

export default router

