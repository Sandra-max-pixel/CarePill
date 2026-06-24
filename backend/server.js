const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();

app.use(cors());
app.use(express.json());

// 👇 Password replace cheyyu
const uri =
"mongodb+srv://Carepill:carepill_iot_2026@carepillcluster.i8hppow.mongodb.net/?retryWrites=true&w=majority&appName=Carepillcluster";

const client = new MongoClient(uri);

let medicineCollection;

// Connect MongoDB
async function connectDB() {
    try {
        await client.connect();

        const db = client.db("carepill");
        medicineCollection = db.collection("status");

        console.log("MongoDB Connected");

        const existing = await medicineCollection.findOne({ device: "esp32" });

        if (!existing) {
            await medicineCollection.insertOne({
                device: "esp32",
                morning: "Pending",
                afternoon: "Pending",
                night: "Pending",
                stock: 30,
                emergency: "Normal"
            });
        }

    } catch (err) {
        console.log(err);
    }
}

connectDB();


// GET STATUS
app.get("/status", async (req, res) => {

    const data = await medicineCollection.findOne({
        device: "esp32"
    });

    res.json(data);
});


// UPDATE STATUS
app.post("/update", async (req, res) => {

    await medicineCollection.updateOne(
        { device: "esp32" },
        {
            $set: req.body
        }
    );

    res.json({
        message: "Updated Successfully"
    });
});


// SERVER
app.listen(3000, () => {
    console.log("Server Running on Port 3000");
});