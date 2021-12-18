import mongoose from "mongoose";

const ClientSchema = new mongoose.Schema({
    clientName: {
        type: String,
        required: [true, "Pole NAME jest wymagane!"],
        minLength: [3, "Minimalna ilość znaków to 3!"],
        unique: [true, "Istnieje juz firma z taką nazwą!"],
      },
      clientAdress:
      {
        adress:String,
        clientNip:String,
      },
      clientScore:{
          type:Number,
      },
    });
    const Client = mongoose.model('Client', ClientSchema)
    export default Client