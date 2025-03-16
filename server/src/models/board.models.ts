import mongoose, { Mongoose, Schema } from "mongoose";
const boardSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    lists:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"List"
    }],
    favourite:{
        type: Boolean,
        default: false
    }

},{timestamps:true});
export const boardModel = mongoose.model("Board", boardSchema);