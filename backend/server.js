const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");

const app = express();

app.use(cors());
app.use(express.json());

const uri = "mongodb://Carepill:carepill_iot_2026@ac-dkq3djh-shard-00-00.i8hppow.mongodb.net:27017,ac-dkq3djh-shard-00-01.i8hppow.mongodb.net:27017,ac-dkq3djh-shard-00-02.i8hppow.mongodb.net:27017/?ssl=true&replicaSet=atlas-hvjo6m-shard-0&authSource=admin&appName=Carepillcluster";

const client = new MongoClient(uri);

let medicineCollection;

// Connect MongoDB
async function connectDB() {
    try {
        await client.connect();

        const db = client.db("carepill");
        medicineCollection = db.collection("status");

        console.log("MongoDB Connected");

        const existing = await medicineCollection.findOne({
            device: "esp32"
        });

        if (!existing) {
            await medicineCollection.insertOne({
                device: "esp32",
                morning: "taken",
                afternoon: "Pending",
                night: "taken",
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
    if (!medicineCollection) {
    return res.status(500).json({
        error: "Database not connected"
    });
}


    const data = await medicineCollection.findOne({
        device: "esp32"
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
if (!medicineCollection) {
return res.status(500).json({
error: "Database not connected"
});
}


    await medicineCollection.updateOne(
        { device: "esp32" },
        {
            $set: req.body
        }
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

// Start Server After DB Connection
async function startServer() {
await connectDB();


app.listen(3000, () => {
    console.log("Server Running on Port 3000");
});


}

startServer();
