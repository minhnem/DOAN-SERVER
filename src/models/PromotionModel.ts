import mongoose, { Schema } from "mongoose";

const schema = new Schema(
    {
        title: {
            type: String,
            require: true
        },
        description: String,
        code: {
            type: String,
            require: true
        },
        value: {
            type: Number,
            require: true
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
            require: true
        },
        endAt: Date,
    },
    {timestamps: true}
)

const PromotionModel = mongoose.model('promotions', schema)
export default PromotionModel