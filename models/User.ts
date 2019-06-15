import mongoose, { Schema } from 'mongoose';
import uniqueValidator  from 'mongoose-unique-validator';
import bcrypt from 'bcrypt';
import { userModel } from './Interfaces'

// User model config
const UserSchema: mongoose.Schema<any>  = new Schema({ 
    username: {type: String, required: true, unique: true },
    password: {type: String, required: true },
    email: {type: String, required: true },
    resetPasswordToken: {type: String},
    resetPasswordExpiration: {type: String}
 });

UserSchema.plugin(uniqueValidator);

export const User: mongoose.Model<any> = mongoose.model("User", UserSchema);

export function saveUser(newUser: userModel, callback: any) {    
    bcrypt.genSalt(10, (err: Error, salt: string) => {
        if (err) console.error(err);
        bcrypt.hash(newUser.password, salt, (err: Error, hash: string) => {
            if (err) console.error(err);
            newUser.password = hash;
            newUser.save(callback); 
        });
    });
}
