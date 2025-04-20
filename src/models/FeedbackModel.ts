import mongoose, { Schema } from "mongoose";

const scheme = new Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    content: {
        type: String,
        require: true
    },
    status: String
}, { timestamps: true })

const FeedbackModel = mongoose.model('feedback', scheme)
export default FeedbackModel