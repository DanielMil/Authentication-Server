import mongoose, { Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

// User model config
const UserSchema: mongoose.Schema<any> = new Schema({
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    resetPasswordToken: { type: String },
    resetPasswordExpiration: { type: String }
});

UserSchema.plugin(uniqueValidator);

export const User: mongoose.Model<any> = mongoose.model("User", UserSchema);

