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
        section: {  
            type: String
        },
        students: [
            { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: "Student" 
            }
        ],
        teachers: [
            { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: "Teacher" 
            }
        ]
    }
)

export const Class=  mongoose.model("Class", classSchema);