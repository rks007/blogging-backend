import express from "express"
import router from "./routes/index.route";
import dotenv from "dotenv"
import cookieparser from "cookie-parser"
import connectDB from "./lib/db";

dotenv.config();

const app = express()

app.use(express.json());
app.use(cookieparser());

// Connect to MongoDB before starting server
connectDB().then(() => {
    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    });
});

app.get("/", (req, res) => {
    res.send("hi there")
})

app.use("/api/v1", router);

app.listen(3000, () => {
    console.log("Server is running on port 3000")
})