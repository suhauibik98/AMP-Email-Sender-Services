require("dotenv").config({ path: "./config/.env" });
const express = require("express");
const cors = require("cors");
const connectionDB = require("./db/connectiondb");
const { transporter } = require("./config/emailConfig");

const authMiddleware = require("./middleware/authMiddleware");
const emailRouter = require("./routes/emailRouter");

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: process.env.ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use("/api/v1", authMiddleware, emailRouter);

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await transporter.verify();
    console.log("✅ SMTP server is ready");

    await connectionDB(); // ✅ connect BEFORE listen
    console.log("✅ Mongo connected");

    app.listen(PORT, () => {
      console.log(`✅ Email service running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error starting server:", error);
    process.exit(1);
  }
}

start();
