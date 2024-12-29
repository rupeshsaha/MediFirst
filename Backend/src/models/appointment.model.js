import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  patientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Patient', 
    required: true 
},
  doctorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Doctor', 
    required: true 
},
  appointmentDateAndTime: { 
    type: Date, 
    required: true 
},
  notes : {
    type: String
  },
  isFirstTime: { 
    type: Boolean, 
    default: false 
},
fee : {
  type: Number,
  required: true
},
  discountApplied: { 
    type: Number, 
    default: 0 
},
  finalFee: { 
    type: Number, 
    required: true 
},
  paymentStatus: { 
    type: String, 
    enum: ['Pending', 'Completed'], 
    default: 'Pending' 
}
}, { timestamps: true });

export const Appointment = mongoose.model('Appointment', appointmentSchema);
