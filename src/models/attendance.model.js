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
        classId: {  
            type: mongoose.Schema.Types.ObjectId,
            ref: "Class"
        },
        present: {
            type: Boolean,
            required: true
        }
    }
)

export default mongoose.model("Attendance", attendanceSchema);