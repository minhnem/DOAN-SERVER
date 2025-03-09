import mongoose, { Schema } from "mongoose";

const schema = new Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    photoUrl: String,

    rule: {
        type: Number,
        default: 1
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

const UserModel = mongoose.model('users', schema)
export default UserModel