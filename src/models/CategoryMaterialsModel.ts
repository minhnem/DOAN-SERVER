import mongoose, { Schema } from "mongoose";

const schema = new Schema({
    title: {
        type: String,
        required: true,
    },
    parentId: String,
    slug: {
        type: String,
    },
    description: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
})

const CategoryMaterialsModel = mongoose.model('categories materials', schema)
export default CategoryMaterialsModel