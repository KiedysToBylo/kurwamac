import mongoose from "mongoose";

const CarSchema = new mongoose.Schema({
    carPlats:{
      type:String,
      required: true,
    },
    carID:{
      type:Number,
      required: true,
    }
  });
    const Car = mongoose.model('Car', CarSchema)
    export default Car