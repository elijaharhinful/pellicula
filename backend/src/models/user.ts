import mongoose, { Schema, Document } from 'mongoose';
import { User as UserInterface } from '../types';

interface UserDocument extends UserInterface {}

const UserSchema = new Schema<UserDocument>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 20
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  favourites: [{
    type: String,
    ref: 'Movie'
  }]
}, {
  timestamps: true
});

export default mongoose.model<UserDocument>('User', UserSchema);