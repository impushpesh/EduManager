import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const studentSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
        },
        SID: {
            type: String,
            required: true,
            unique: true,
            index: true,
            trim: true,
        },
        gender : {

            type: String,
            enum: ['Male', 'Female', 'Other'],
            required: true
        },
        DOB :{
            type: Date,
            required: true
        },
        contactNumber : {
            type: String,
            required: true,
            trim: true
        },
        email: {   
            type: String,
            trim: true
        },
        father:{
            type: String,
            required: true
        },
        fatherContactNumber: {
            type: String,
            required: true,
            trim: true,
        },
        mother : {
            type: String,
            required: true
        },
        motherContactNumber: {
            type: String,
            required: true,
            trim: true
        },
        address : {
            type: String,
            required: true
        },
        enrollmentDate : {
            type: Date,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        pendingFees: {
            type: Number,
            required: true,
            default: 0
        },
        grades: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Grades",
            default: null
        },
        notice: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Notice"
        },
        attendance: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Attendance",
            default: null
        },
        refreshToken: {
            type: String
        }
    }
)

// Password hashing
studentSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, 10)
    next()    
})

// Password validation
studentSchema.methods.isValidPassword = async function(password){
    return await bcrypt.compare(password, this.password)
}

// JWT token generation
studentSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            SID: this.SID,
            name: this.name,
            email: this.email
        }, 

        process.env.ACCESS_TOKEN_SECRET,

        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

studentSchema.methods.generateRefreshToken = function (){
    return jwt.sign( 
        { 
            _id: this._id,
            SID: this.SID,
            name: this.name,
            email: this.email
        }, 

        process.env.REFRESH_TOKEN_SECRET, 

        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const Student =  mongoose.model('Student', studentSchema);