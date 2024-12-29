import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    location: {
        type: String,
    },
    experience : {
        type: Number
    },
    specialization : {
        type: String
    },
    about : {
        type: String
    },
    consultationFee : {
        type: Number,
        required: true
    },
    totalEarnings: {
        type: Number,
        default: 0
    }
},{ timestamps: true });

export const Doctor = mongoose.model("Doctor", doctorSchema)