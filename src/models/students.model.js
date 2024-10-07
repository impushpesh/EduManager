import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
    {
        name:{
            type: String,
            required: true,
        },
        studentId: {
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
        rollNo :{
            type: Number,
            required: true,
            unique: true,
            index: true,
            trim: true,
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
        className : {
            type: String,
            required: true
        },
        coursesEnrolled: [{   
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course"
        }],
        password: {
            type: String,
            required: true
        }
    }
)

// Password hashing
studentSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next()
    this.password = bcrypt.hash(this.password, 10)
    next()    
})

// password validation

studentSchema.methods.isValidPassword = async function(password){
    return await bcrypt.compare(password, this.password)
}

// JWT token generation

studentSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            id: this._id,
            studentId: this.studentId,
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
            studentId: this.studentId,
        }, 

        process.env.REFRESH_TOKEN_SECRET, 

        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const Student =  mongoose.model('Student', studentSchema);