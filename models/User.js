import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    email: { type: String, required: true},
    name: { type: String, required: true },
    imageUrl: { type: String  ,required:true},
    cartItems: { type: Object, default: {} },

},{minimize:false});

export default mongoose.models.User || mongoose.model("User", userSchema);