import app from "./app";
import mongoose from "mongoose";
import configaration from "./app/configaration";
import { Server } from 'http';

let server: Server;

async function main() {

    try {

        await mongoose.connect(configaration.database_url as string);

        server = app.listen(configaration.port, () => {
            console.log(`Example app listening on port ${configaration.port}`)
        });

    } catch (error) {
        console.log('Server is not connected to mongoDB.');
    }
}



main()

process.on('unhandledRejection', () => {
    console.log(`Unhandled Rejection. Shutting down...`);
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }
    process.exit(1);
})

process.on('uncaughtException', () => {

    console.log(`Uncaught Exception. Shutting down...`);
    process.exit(1);

})