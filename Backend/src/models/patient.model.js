import mongoose from "mongoose"

const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true,
        unique: true
    },
    walletBalance : {
        type: Number,
        default: 0
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    firstTimeDiscountsUsed: [
        {
            doctorId: {
                type: mongoose.Types.ObjectId,
                ref: "Doctor"
            },
            usedAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
},{ timestamps: true });

export const Patient = mongoose.model("Patient", patientSchema);