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


//app.use()

export {app}