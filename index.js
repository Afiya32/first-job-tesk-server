const express = require("express");
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT||5000;
const { ObjectId } = require('mongodb');

// middleware
app.use(cors());
app.use(express.json());


const uri = "mongodb+srv://first-client:3wQ98ETh8vjuzg7p@cluster0.fffaqtl.mongodb.net/?retryWrites=true&w=majority";

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
  //  database collection
  const tesksCollection = client.db('TeskManagementDB').collection('Tesks');

// read data
app.get("/tesks", async (req, res) => {
  const curser = tesksCollection.find();
  const result = await curser.toArray();
  res.send(result);
});
// add data


app.post('/tesks',async(req,res)=>{
  const newTesk = req.body;
  console.log(newTesk);
  const result = await tesksCollection.insertOne(newTesk);
  res.send(result);
});
// deleted data

app.delete('/tesks/:id', async (req, res)=>{
  const id = req.params.id;
  const query= {_id: new ObjectId(id)}
  const result= await tesksCollection.deleteOne(query);
  res.send(result);
})
// single tesks
app.get('/tesks/:id', async (req, res) => {
  const id = req.params.id;
console.log('ID:', id);
const query = { _id: new ObjectId(id) };
console.log('Query:', query);
  try {
    const result = await tesksCollection.findOne(query);
    if (result) {
      res.send(result);
    } else {
      res.status(404).send('tesk is not found');
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
  
  
});





    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/',(req,res)=>{
    res.send('server is running')
})
app.listen(port,()=>{
    console.log(`Server started on port:${port}`)
})