import mongoose, { Schema } from "mongoose";

const schema = new Schema({
    tableId: {
        type: String,
        required: true
    },
    title: String,
    price: Number,
    images: [String], 
    count: Number,
    dishId: {
        type: String,
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const OrderModel = mongoose.model('orders', schema)
export default OrderModel