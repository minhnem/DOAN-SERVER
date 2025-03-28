import mongoose, { Schema } from "mongoose";

const scheme = new Schema({
    table_id: String,
    name: {
        type: String,
        require: true
    },
    phone: {
        type: Number,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    reservation_time: {
        type: Date,
        default: Date.now()
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