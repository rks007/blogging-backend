import express from "express"
import router from "./routes/index.route";
import dotenv from "dotenv"
import cookieparser from "cookie-parser"
import connectDB from "./lib/db";
import redisClient from "./lib/redis";
import axios from "axios";

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



app.get("/", async (req, res) => {
    const cachedValue = await redisClient.get("todos");

    if(cachedValue){
        console.log("cached");
        
        return res.json({todos: JSON.parse(cachedValue)});
    }

    const response = await axios.get("https://jsonplaceholder.typicode.com/todos")

    await redisClient.set("todos", JSON.stringify(response.data), "EX", 20 );//setting the value to expire in 20 seconds

    res.json({todos: response.data})
})

app.use("/api/v1", router);

app.listen(3000, () => {
    console.log("Server is running on port 3000")
})