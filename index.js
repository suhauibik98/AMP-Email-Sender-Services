require("dotenv").config({path: "./config/.env"});
const express = require("express");
const cors = require("cors");
const connectionDB = require("./db/connectiondb");


const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;


app.use(cors({
  origin:process.env.ORIGIN ,
  methods: ["GET", "POST", "PUT", "DELETE" , "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

const authMiddleware = require("./middleware/authMiddleware");
const emailRouter = require("./routes/emailRouter");
app.use("/api/v1",authMiddleware, emailRouter);

app.listen(PORT,async () => {
    try {
        await connectionDB();
        console.log(`Email service is running on port ${PORT}`);
    } catch (error) {
        console.error("Error starting the server:", error);
        
    }
});