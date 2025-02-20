// const express = require("express");
// const app = express();
// const cors = require("cors");
// require("dotenv").config();
// const port = process.env.PORT || 5001;

// // middlewares
// app.use(cors());
// app.use(express.json());

// const { MongoClient, ServerApiVersion } = require("mongodb");
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.c4n3e.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     const taskCollection = client.db("toDoDB").collection("tasks");

//     // post task data
//     app.post("/tasks", async (req, res) => {
//       const task = req.body;
//       const result = await taskCollection.insertOne(task);
//       res.send(result);
//     });

//     // get task data
//     app.get("/tasks", async (req, res) => {
//       const result = await taskCollection.find().toArray();
//       res.send(result);
//     });

//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log(
//       "Pinged your deployment. You successfully connected to MongoDB!"
//     );
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);

// app.get("/", (req, res) => {
//   res.send("Task Is Coming Soon");
// });

// app.listen(port, () => {
//   console.log(`Task is running on port ${port}`);
// });

const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5001;

// Middlewares
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require("mongodb");
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
    await client.connect();
    taskCollection = client.db("toDoDB").collection("tasks");
    console.log("Connected to MongoDB ");
  } catch (error) {
    console.error("MongoDB connection error :", error);
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

// Root Route
app.get("/", (req, res) => {
  res.send("Task API is running!");
});

// Start Server
app.listen(port, () => {
  console.log(` Server is running on port ${port}`);
});
