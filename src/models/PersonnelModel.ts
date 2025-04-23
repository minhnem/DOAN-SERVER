import mongoose, { Schema } from "mongoose";

const scheme = new Schema({
    name: {
        type: String,
        required: true
    },
    slug: String,
    phone: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'Nhân viên'
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
})

const PersonnelModel = mongoose.model('personnel', scheme)
export default PersonnelModel