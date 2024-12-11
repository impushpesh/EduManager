import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    noticeId: {
        type: String,
        required: true,
        unique: true,
        trim: true,

    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

export const Notice = mongoose.model('Notice', noticeSchema);