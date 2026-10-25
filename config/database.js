import mongoose from "mongoose"

export const connectToDb=()=>{
    mongoose.connect("mongodb+srv://uditsisodia1234_db_user:RsepxvXZ6AeAHVPF@cluster0.7d3l4u6.mongodb.net/assessment")
    .then(()=>{
        console.log("databse is connected")
    })
}