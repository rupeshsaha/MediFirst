import express from "express"
import { connectToDatabase } from "./src/db/db.js";
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import patientRouter from "./src/routes/patient.routes.js"
import doctorRouter from "./src/routes/doctor.routes.js"
import transactionRouter from "./src/routes/transaction.routes.js"
import authRouter from "./src/routes/auth.routes.js"
dotenv.config()

const app = express();
const PORT = process.env.PORT;

connectToDatabase();
app.use(express.json())
app.use(cors({origin: process.env.CLIENT_URL, credentials: true}))
app.use(cookieParser())


app.use("/patient",patientRouter)
app.use("/doctor", doctorRouter)
app.use("/transaction", transactionRouter)
app.use("/auth", authRouter)

app.listen(PORT, ()=>{
    console.log(`Server is running on https://localhost:${PORT}`);
    
})