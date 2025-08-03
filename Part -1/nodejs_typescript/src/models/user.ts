import e from "express";
import mongoose, { Document, model, Schema } from "mongoose";

interface iUser extends Document{
    name: string,
    email: string,
    password: string,
    age: number,
    createdAt: Date
}

const UserSchema = new Schema<iUser>({
    name: String,
    email: String,
    password: String,
    age: Number,
    createdAt: Date
})

const User = model('User', UserSchema);

export {User, iUser}

