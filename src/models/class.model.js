import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
    {
        classId: {
            type: String,
            required: true,
            unique: true
        },
        className: {
            type: String,
            required: true
        },
        representative: {
            type: String,
            ref: "Teacher"
        },
        students: [
            { 
                type: String, 
                ref: "Student" 
            }
        ],
        teachers: [
            { 
                type: String, 
                ref: "Teacher" 
            }
        ]
    }
)

export const Class =  mongoose.model("Class", classSchema);