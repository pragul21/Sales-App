const mongoose = require('mongoose');
// const { ObjectId } = mongoose.Schema.Types;

const postSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },


}, { timestamps: true });

mongoose.model("PostModel", postSchema);