const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
require("dotenv").config();

//Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.MY_USER}:${process.env.MY_PASSWORD}@cluster0.z9k4k.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const tasksCollection = client.db("To-Do-APP").collection("tasks");
    //Get all Tasks
    app.get("/tasks", async (req, res) => {
      const tasks = await tasksCollection.find().toArray();
      res.send(tasks);
    });
    //Add a Task
    app.post("/tasks", async (req, res) => {
      const newTask = req.body;
      console.log(newTask);
      const result = await tasksCollection.insertOne(newTask);
      res.send(result);
    });
    //Delete a Specific Task item
    app.delete("/tasks/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await tasksCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
