import mongoose, { Schema } from "mongoose";

const scheme = new Schema({
    tableId: {
        type: String,
        required: true
    },
    dishItem: [
        {
            title: String,
            count: Number,
            price: Number,
        }
    ],
    discount: Number,
    totalPrice: {
        type: Number,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const BillModel = mongoose.model('bills', scheme)
export default BillModel