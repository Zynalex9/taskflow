import mongoose, { Mongoose, Schema } from "mongoose";
const boardSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    admin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    projects:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Project"
    }],
    members:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }],


},{timestamps:true});
export const boardModel = mongoose.model("Board", boardSchema);