import mongoose, { Mongoose, Schema } from "mongoose";

const tableSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    rows:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Task"
    }],
    

},{timestamps:true});
export const tableModel = mongoose.model("Table", tableSchema);