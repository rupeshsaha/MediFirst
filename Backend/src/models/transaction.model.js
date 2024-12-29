import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    appointmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },
    amount: { 
        type: Number, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ["Success", "Failed"], 
        default: "Success" 
    },
    transactionDate: { 
        type: Date, 
        default: Date.now 
    },
  },
  { timestamps: true }
);

export const Transaction= mongoose.model("Transaction", transactionSchema);
