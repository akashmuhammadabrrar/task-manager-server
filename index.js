const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5001;

// Middlewares
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.c4n3e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Declare taskCollection globally so it persists
let taskCollection;

// Connect to MongoDB once
async function connectDB() {
  try {
    // await client.connect();
    taskCollection = client.db("toDoDB").collection("tasks");
    // console.log("Connected to MongoDB ");
  } catch (error) {
    // console.error("MongoDB connection error :", error);
  }
}

// Call the function to connect to the database
connectDB();

// POST task data
app.post("/tasks", async (req, res) => {
  try {
    const task = req.body;
    const result = await taskCollection.insertOne(task);
    res
      .status(201)
      .json({ message: "Task added successfully", taskId: result.insertedId });
  } catch (error) {
    console.error("Error adding task:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

// GET task data
app.get("/tasks", async (req, res) => {
  try {
    const result = await taskCollection.find().toArray();
    res.json(result);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

// delete task data
app.delete("/tasks/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await taskCollection.deleteOne(query);
  res.send(result);
});
// update the task
app.put("/tasks/:id", async (req, res) => {
  const id = req.params.id;
  const updatedTask = req.body;

  // Remove the _id field from the update payload
  delete updatedTask._id;

  const query = { _id: new ObjectId(id) };
  const result = await taskCollection.updateOne(query, { $set: updatedTask });
  res.send(result);
});

// Root Route
app.get("/", (req, res) => {
  res.send("Task API is running!");
});

// Start Server
app.listen(port, () => {
  console.log(` Server is running on port ${port}`);
});
