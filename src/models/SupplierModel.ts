import mongoose, { Schema } from "mongoose";

const SupplierSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    slug: String,
    product: String,
    price: Number,
    contact: String,
    email: String,
    photoUrl: String,
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
})

const SupplierModel = mongoose.model("suppliers", SupplierSchema)
export default SupplierModel