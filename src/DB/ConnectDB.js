import mongoose from "mongoose";
import 'dotenv/config'
import chalk from "chalk";

export const ConnetDB = async () => {
    await mongoose.connect(process.env.URL).then(
        console.log(chalk.blue("DB Connected Successfully"))

    ).catch(err => {
        console.log(chalk.red("Connection Failed: ", err))
    })
}