import mongoose, { Mongoose, Schema } from "mongoose";
const TodoSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    dueDate:{
        type:Date,
    },
    status:{
        type:String,
        enum:["todo","inprogress","done"],
        default:"todo"
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User" 
    },
})
export const TodoModel = mongoose.model("Todo", TodoSchema);