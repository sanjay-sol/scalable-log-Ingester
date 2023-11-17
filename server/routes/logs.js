// routes/logs.js
import express from "express";
import Log from "../models/logs.js";
import axios from "axios";
const router = express.Router();

// In-memory cache for processed logs
const logCache = [];

router.get("/", (req, res) => {
    res.send("Hello1");
});


export default router;
