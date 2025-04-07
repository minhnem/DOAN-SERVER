import mongoose, { Schema } from "mongoose";

const schema = new Schema({
    title: {
        type: String,
        required: true
    },
    slug: String,
    description: String,
    content: String,
    categories: [String],
    price: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: 'Phục vụ'
    },
    images: {
        type: [String]
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    },
    isDeleted: {
        type: Boolean,
        default: false
    }

})

const DishModel = mongoose.model('dishes', schema)
export default DishModel