import mongoose, { Schema } from "mongoose";

const scheme = new Schema({
    table_id: String,
    name: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    reservation_time: String,
    reservation_date: {
        type: Date,
        default: Date.now()
    },
    status: {
        type: String,
        default: 'Chờ xử lý'
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

const ReservationModel = mongoose.model('reservation', scheme)
export default ReservationModel