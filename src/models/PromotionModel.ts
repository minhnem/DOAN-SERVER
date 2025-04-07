import mongoose, { Schema } from "mongoose";

const schema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: String,
        code: {
            type: String,
            required: true
        },
        value: {
            type: Number,
            required: true
        },
        numOfAvailabel: {
            type: Number,
            default: 100
        },
        type: {
            type: String,
            default: 'Giảm giá'
        },
        startAt: {
            type: Date,
            required: true
        },
        endAt: Date,
    },
    {timestamps: true}
)

const PromotionModel = mongoose.model('promotions', schema)
export default PromotionModel