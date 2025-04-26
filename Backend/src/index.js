import express from "express"
import dotenv from "dotenv";
import cookieParsor from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";


dotenv.config();

const app=express();

app.use(express.json());
app.use(cookieParsor());


app.get("/",(req,res)=>{
    res.send("Hello this is cohort ⏳⏳");
})

app.use("/api/v1/auth",authRoutes);

app.listen(process.env.PORT,()=>{
    console.log("Server is running on port 8080");
})