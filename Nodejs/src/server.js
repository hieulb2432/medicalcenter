import bodyParser from "body-parser";
import express from "express";
import viewEngine from "./config/viewEngine";
import connectDB from "./config/connectDB"
import initWebRouters from "./route/web";
import cors from 'cors';

require('dotenv').config()

let app = express();
app.use(cors({ origin: true }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

viewEngine(app);
initWebRouters(app);

connectDB();

let port = process.env.PORT;
app.listen(port, () => {
    console.log("Nodejs is running on port " + port)
})