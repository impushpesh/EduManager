import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        courseId: {  
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course"
        },
        present: {
            type: Boolean,
            required: true
        }
    }
)

export const Attendance =  mongoose.model("Attendance", attendanceSchema);