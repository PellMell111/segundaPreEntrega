import mongoose from "mongoose";

const cartCollection = "carritos";

const cartSchema = new mongoose.Schema({
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'productModel', required: true },
        quantity: { type: Number, default: 1 }
    }]});

const cartModel = mongoose.model(cartCollection, cartSchema);

export default cartModel;