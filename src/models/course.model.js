import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
    {
        courseId: {
            type: String,
            required: true,
            unique: true
        },
        courseName: {
            type: String,
            required: true
        },
        teachersAssigned: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Teacher"
            }
        ],
        studentsEnrolled: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Student"
            }
        ]
    }
)

export default mongoose.model("Course", courseSchema);