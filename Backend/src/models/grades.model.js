import mongoose from "mongoose";

const gradeSchema = new mongoose.Schema({
    SID: {
        type: String,
        required: true,
        ref: "Student"
    },
    courseId: {
        type: String,
        required: true,
        ref: "Course"
    },
    grade: {
        type: Number,
        required: true
    }
    
})

export const Grades = mongoose.model('Grades', gradeSchema);