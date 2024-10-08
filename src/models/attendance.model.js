import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
    {
        SID: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        present: {
            type: Boolean,
            required: true
        }
    }
)

export const Attendance =  mongoose.model("Attendance", attendanceSchema);