import mongoose  from "mongoose";


const dbConnect = async()=>{
    try {
        mongoose.connection.on("connected", ()=>{
            console.log("Db is connected successfully")
        })
        await mongoose.connect(process.env.MONGODB_URL)
    } catch (error) {
        console.log("not connected", error);
    }

}

export default dbConnect;