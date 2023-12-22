const express = require('express')
require('dotenv').config()
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// middleware
app.use(cors())
app.use(express.json())

// taskManagementDB
// ANKjjxKcVXug1jFq

app.get('/', (req, res) => {
    res.send('Hello World!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nc6s3b6.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // await client.connect();
        const taskCollection = client.db("taskManagementDB").collection("tasks");

        // task get api
        app.get('/api/v1/taskGetById/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const task = await taskCollection.findOne(query)
            res.send(task)
        })
        // task get api
        app.get('/api/v1/taskGet', async (req, res) => {
            const task = await taskCollection.find().toArray()
            res.send(task)
        })

        // task create api
        app.post('/api/v1/taskCreate', async (req, res) => {
            const task = req.body
            const result = await taskCollection.insertOne(task)
            res.send(result)
        })

        // task update api
        app.put('/api/v1/taskUpdate/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: new ObjectId(id) }
            const task = req.body
            const options = { upsert: true }
            const updateDoc = {
                $set: {
                    title: task.title,
                    description: task.description,
                    deadline: task.deadline,
                    priority: task.priority,
                    status: task.status

                },
            };
            const result = await taskCollection.updateOne(filter, updateDoc, options);
            res.send({ result })
        })

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})