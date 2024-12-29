import { Appointment } from "../models/appointment.model.js";
import { Doctor } from "../models/doctor.model.js";
import { Patient } from "../models/patient.model.js";
import { Transaction } from "../models/transaction.model.js";

const createTransaction = async (req, res) => {
   try {
     const { appointmentId } = req.query
     const patientId = req.user?._id
 
     const patient = await Patient.findById(patientId)
     const appointment = await Appointment.findById(appointmentId)
     
     const doctorId = appointment.doctorId
     const amount = appointment.finalFee
 
 
 
     if(!patient){
         return res.status(400).json({message: "Invalid Patient Id"})
     }
 
     if(appointment.paymentStatus === "Completed"){
         return res.status(200).json({message: "You have already Paid For this Appointment"})
     }
 
     if(patient.walletBalance-amount<0){
         return res.status(400).json({message: "Insufficient Balance, Please Recharge your wallet"})
     }
 
     if(!appointment){
         return res.status(400).json({message: "Invalid appointment Id"})
     }
 
     const debitByPatient = await Patient.findByIdAndUpdate(
         appointment.patientId,{
             $inc :{walletBalance: -amount}
         },
         {new: true}
     )
 
     if(!debitByPatient){
         status = "Failed"
         return res.status(500).json({message: "Failed To Create Transaction"}) 
     }
 
 
     const creditToDoctor = await Doctor.findByIdAndUpdate(appointment.doctorId,{
         $inc : {totalEarnings: amount}
     },{new:true})
 
     if(!creditToDoctor){
        status = "Failed"
        return res.status(500).json({message: "Failed To Create Transaction"}) 
     }
 
     const updatedBalance ={
         patientBalance : debitByPatient.walletBalance,
         doctorBalance : creditToDoctor.totalEarnings
     }
 
     const transaction = await Transaction.create({
         patientId,
         doctorId,
         appointmentId,
         amount,
         status: "Success"
     })
 
     appointment.paymentStatus = "Completed";
     await appointment.save()
 
     return res.status(200).json({message: "Transaction Success",transaction,updatedBalance: updatedBalance})
   } catch (error) {
    console.error("Error in creating transaction",error.message)
    return res.status(500).json({error})
   }

}

const rechargeWallet = async (req, res) => {
    const { amount } = req.body;

  try {
    if (!amount || amount <= 0) {
      return res
        .status(400)
        .json({ message: "Credit amount must be greater than 0" });
    }

    const updatedPatient = await Patient.findByIdAndUpdate(
      req.user?._id,
      {
        $inc: { walletBalance: amount },
      },
      { new: true }
    );

    if (!updatedPatient) {
      return res.status(400).json({ message: "Patient not found" });
    }

    return res.status(200).json({
      message: "Wallet credited successfully",
      walletBalance: updatedPatient.walletBalance,
    });
  } catch (error) {
   console.error("Error in credit wallet :", error.message);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }  
}

const getAllTransactions = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: User not logged in" });
    }

    const { page = 1, limit = 12 } = req.query;

    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 12;
    const skip = (pageNumber - 1) * limitNumber;


    const filter = {
      $or: [
        { patientId: userId },
        { doctorId: userId }
      ]
    };


    const transactions = await Transaction.find(filter)
      .skip(skip)
      .limit(limitNumber)
      .populate("patientId", "name")
      .populate("doctorId", "name")
      .sort({ createdAt: -1 })

    const totalTransactions = await Transaction.countDocuments(filter);
    const totalPages = Math.ceil(totalTransactions / limitNumber);


    return res.status(200).json({
      transactions,
      totalTransactions,
      totalPages,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error.message);
    return res.status(500).json({ message: "Server error while fetching transactions" });
  }
};





export {
    createTransaction,
    rechargeWallet,
    getAllTransactions
}