import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
const teacherSchema = new mongoose.Schema(
    {
        teacherName : {
            type: String,
            required: true
        },
        teacherId : {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        contact: {
            type: String,
            required: true,
            trim: true
        },
        department: {   
            type: String
        },
        password: {
            type: String,
            required: true
        },
        notice: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Notice"
        },
        refreshToken: {
            type: String
        }
    }
)

// Password hashing
teacherSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next()
    this.password = await  bcrypt.hash(this.password, 10)
    next()    
})

// password validation

teacherSchema.methods.isValidPassword = async function(password){
    return await bcrypt.compare(password, this.password)
}

// JWT token generation
teacherSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            teacherId: this.teacherId

        }, 

        process.env.ACCESS_TOKEN_SECRET,

        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

teacherSchema.methods.generateRefreshToken = function (){
    return jwt.sign( 
        { 
            _id: this._id,
            teacherId: this.teacherId
        }, 

        process.env.REFRESH_TOKEN_SECRET, 

        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const Teacher =  mongoose.model('Teacher', teacherSchema);
