import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { isValidEmail } from '../validators.js';
import randomstring from 'randomstring';
const userSchema = new mongoose.Schema({
    email: {
      type: String,
      required: [true, 'Email jest wymagany!'],
      trim: true,
      lowercase:true,
      unique: true,
      validate: [isValidEmail, 'Email nieprawidłowy!']
    },
    password: {
      type: String,
      required: [true, "Pole NAME jest wymagane!"],
      minLength: [4, "Minimalna ilość znaków to 4!"],
    },
    apiToken: {
      type: String,
    },
    userId:{
      type:String,
    },
    userRank:{
      type:String,
      required: [true, 'Ranga użytkownika jest wymagana!'],
    },
    userImie:{
      type:String,
      trim: true,
      required: [true, 'Imię jest wymagane!'],
    },
    userNazwisko:{
      trim: true,
      type:String
    },
    userPhone:{
      trim: true,
      type:Number
    },
    userMembership:{
      type:Number,
      trim:true,
      required: true,
    }

  });
  userSchema.pre('save', function(next)
  {
    const user = this;
    if (user.isNew) {
      user.apiToken = randomstring.generate(30);
    }
    if (!user.isModified('password')) return next();
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(user.password, salt);
    user.password =hash;
    next();
  });
  
  userSchema.methods = {
    comparePassword(password)
    {
      return bcrypt.compareSync(password, this.password);
    }
  }

  const user = mongoose.model("user", userSchema);

  export default user;
