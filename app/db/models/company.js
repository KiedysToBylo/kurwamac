import mongoose from "mongoose";
// import CarSchema from "./car.js"
import { checkForbidenString } from '../validators.js'


// model
const CompanySchema = new mongoose.Schema({

    name: {
      type: String,
      required: [true, "Pole NAME jest wymagane!"],
      minLength: [3, "Minimalna ilość znaków to 3!"],
      unique: [true, "Istnieje juz firma z taką nazwą!"]
    },
    image: {
      type:String,
    },
    companyId:{
      type:Number,
      unique:true,
    },
    companyAdress:
    {
      adress:String,
      companyNip:String,
    },
  });
  CompanySchema.pre('save', function(next)
  {
    const Company = this;
  if (Company.isNew) {
    Company.companyId = Math.floor(Math.random() * (50000 - 10000) + 10000);
    next();
  }
  next();
})
  const Company = mongoose.model("Company", CompanySchema);

  export default Company;

   // slug: {
    //   type: String,
    //   required: [true, "Pole SLUG jest wymagane!"],
    //   minLength: [3, "Minimalna ilość znaków to 3!"],
    //   validate: (value) => checkForbidenString(value, "slug"),
    //   trim: true,
    //   lowercase:true,
    // },

        // user: {
    //   type: mongoose.Types.ObjectId,
    //   required: true,
    //   ref: 'user',
    // },