import mongoose, { Schema } from "mongoose";

const schema = new Schema({
    tableId: {
        type: String,
        require: true
    },
    title: String,
    price: Number,
    images: [String], 
    count: Number,
    dishId: {
        type: String,
        require: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const OrderModel = mongoose.model('orders', schema)
export default OrderModel