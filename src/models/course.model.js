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
        HOD: {
            type:String,
            ref: "Teacher"
        },
        teachersAssigned: [
            {
                type: String,
                ref: "Teacher",
                req: true
            }
        ],
        studentsEnrolled: [
            {
                type: String,
                ref: "Student"
            }
        ]
    }
)

export const Course =  mongoose.model("Course", courseSchema);