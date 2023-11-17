import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import logs from "./routes/logs.js";

import "./models/logs.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3003;

app.use(express.json());
app.use(cors({ origin: "*" }));

/*****************  MONGOOSE CONNECTION  ********************************************  */

mongoose.connect(process.env.MONGO_URI);

mongoose.connection.on("connected", () => {
    console.log("db connected");
});
mongoose.connection.on("error", (err) => {
    console.log("error in connecting...", err);
});


/*****************  ROUTES ********************************************  */


app.use(logs);


app.listen(PORT || 3003, () =>
    console.log(`Listening on Port ${PORT}`)
);

