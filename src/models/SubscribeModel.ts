import mongoose, { Schema } from "mongoose";

const schema = new Schema({
    email: {
        type: String,
        required: true,
    },

}, { timestamps: true })

const SubscribeModel = mongoose.model('subscribe', schema)
export default SubscribeModel