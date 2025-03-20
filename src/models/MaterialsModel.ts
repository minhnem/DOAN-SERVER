import mongoose, { Schema } from "mongoose";

const scheme = new Schema({
    title: {
        type: String,
        required: true
    },
    slug: String,
    description: String,
    categories: [String],
    supplier: {
        type: String, 
        required: true
    },
    cost: {
        type: Number,
        require: true
    },
    images: {
        type: [String]
    },
    mass: String,
    importDate: {
        type: Date,
        default: Date.now()
    },
    expiryDate: Date,
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

const MaterialsModel = mongoose.model('materials', scheme)
export default MaterialsModel