import {Router} from "express"
import { getLoggedInUser, logout } from "../controllers/auth.controller.js"
import { protectRoute } from "../middlewares/auth.middleware.js"

const router = Router()

router.get("/",protectRoute, getLoggedInUser)
router.post("/logout",protectRoute, logout)

export default router