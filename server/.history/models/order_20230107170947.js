import mongoose from "mongoose";
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;

const orderSchema = new mongoose.Schema( {
  products: [ { type: ObjectId, ref: "Product" } ]

  name: {
    type: String,
    trim: true,
    required: true,
    maxLength: 32,
    unique: true,
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
  },
} );

export default mongoose.model( "Order", orderSchema );
