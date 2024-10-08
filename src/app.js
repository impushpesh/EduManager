import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN, 
    credentials: true
}))

// middleware

app.use(express.json())
app.use(express.urlencoded({ extended:true }))
app.use(express.static("public"))
app.use(cookieParser())

// routes
import adminRouter from "./routes/admin.routes.js"
import studentRouter from "./routes/student.routes.js"



app.use("/admin", adminRouter)
app.use("/student", studentRouter)

export {app}