import mongoose from "mongoose";
import dotenv from "dotenv";

const conectarDB = async () => {
    try {
        const db = await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        const url = `${db.connection.host}:${db.connection.port}`;
        console.log(`Mongo DB conectado en: ${url}`);
    } catch (err) {
        console.log(`Error: ${err.message}`);
        process.exit(1);
    }
}

export default conectarDB;