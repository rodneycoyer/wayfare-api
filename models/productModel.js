const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// mongoose currency
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const commentSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
}, {
    timestamps: true
});

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    cost: {
        type: Currency,
        required: true,
        min: 0,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    comments: [commentSchema]
}, {
    timestamps: true
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;