const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const cron = require("node-cron");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB URI should be stored as an environment variable
const uri = process.env.MONGODB_URI;

if (!uri) {
    console.error("MONGODB_URI is not set");
    process.exit(1);
}

const client = new MongoClient(uri);

let medicineCollection;

// Gmail configuration
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Connect MongoDB
async function connectDB() {
    try {
        await client.connect();

        const db = client.db("carepill");
        medicineCollection = db.collection("status");

        console.log("MongoDB Connected");

        const existing = await medicineCollection.findOne({
            patient: "patient1"
        });

        if (!existing) {
            await medicineCollection.insertOne({
                patient: "patient1",
                morning: "Pending",
                afternoon: "Pending",
                night: "Pending",
                stock: 30,
                emergency: "Normal"
            });
        }

    } catch (err) {
        console.log("MongoDB Error:", err);
    }
}

// GET STATUS
app.get("/status", async (req, res) => {
    try {
        const data = await medicineCollection.findOne({
            patient: "patient1"
        });

        res.json(data);

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

// UPDATE STATUS
app.post("/update", async (req, res) => {
    try {
        await medicineCollection.updateOne(
            { patient: "patient1" },
            { $set: req.body }
        );

        res.json({
            message: "Updated Successfully"
        });

    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
});

// EMERGENCY EMAIL ALERT
app.post("/emergency", async (req, res) => {
    try {
        console.log("EMERGENCY API HIT");

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: "🚨 CarePill Emergency Alert",
            text: "Emergency alert triggered by patient."
        });

        console.log("EMAIL SENT");

        res.json({
            message: "Email Sent Successfully"
        });

    } catch (err) {
        console.log("EMAIL ERROR:");
        console.log(err);

        res.status(500).json({
            error: err.message
        });
    }
});

// Reminder Check Every Minute
cron.schedule("* * * * *", async () => {
    const now = new Date();

    console.log(
        "Reminder Check:",
        now.toLocaleTimeString()
    );
});

// Start Server
async function startServer() {
    await connectDB();

    app.listen(3000, () => {
        console.log("Server Running on Port 3000");
    });
}

startServer();