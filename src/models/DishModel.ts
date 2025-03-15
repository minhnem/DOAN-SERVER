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
    supplier: {
        type: String, 
        required: true
    },
    expiryDate: {
        type: Date
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