import mongoose from "mongoose";

const gradeSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Student"
    },
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Course"
    },
    grade: {
        type: Number,
        required: true
    }
    
})

export const Grades = mongoose.model('Grades', noticeSchema);