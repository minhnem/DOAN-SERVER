import mongoose, { Schema } from "mongoose";

const scheme = new Schema({
    personnelId: String,
    shift: {
        type: String,
        enum: ['Sáng', 'Tối'],
        required: true,
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

const AttendanceModel = mongoose.model('attendance', scheme)
export default AttendanceModel