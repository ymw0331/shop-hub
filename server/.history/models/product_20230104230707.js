import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema;


const productSchema = new mongoose.Schema( {
  name: {
    type: String,
    trim: true,
    required: true,
    maxlength: 160
  }, slug{}
} );