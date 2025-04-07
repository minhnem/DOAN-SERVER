import mongoose, { Schema } from "mongoose";

const scheme = new Schema({
    name: {
        type: String,
        required: true,
    },
    slug: String,
    reservations_id: String,
    status: {
        type: String,
        default: 'Trống',
    },
    order_id: String,
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
})

const TableModel = mongoose.model('table', scheme)
export default TableModel