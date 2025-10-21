import mongoose from "mongoose";
import 'dotenv/config'

export const ConnetDB = async () => {
    await mongoose.connect(process.env.URL).then(
        console.log("DB Connected Successfully")

    ).catch(err => {
        console.log("Connection Failed: ", err);
    })
}