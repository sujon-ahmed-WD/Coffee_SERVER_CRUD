const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// Midalware
app.use(cors());
app.use(express.json());

// UserName:Coffee
// Password:C_for_Coffee

// -------MongodbCord-------

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.v9rdx72.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// const uri = "mongodb+srv://Coffee:C_for_Coffee@cluster0.v9rdx72.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    // Main Collection
    const useCollection = client.db("Coffee").collection("element");

    // Read Operation ------------------

    app.get("/coffee", async (req, res) => {
      const cursor = await useCollection.find().toArray();
      res.send(cursor);
    });

    // -----------------------

    // Updatate Start --------------

    app.get('/coffee/:id',async(req,res)=>{
      const id=req.params.id;
      const quary={_id:new ObjectId(id)}
      const result=await useCollection.findOne(quary)
      res.send(result)
    })
    // {name,chef,supplier,taste,category,details,photo}
    app.put('/coffee/:id',async(req,res)=>{
      const id=req.params.id;
      const user=req.body
      console.log('Update USER',id,user);
      // const filter={_id:new ObjectId(id)}
      // const options={upsert:true};
      // const updatCoffee={
      //   $set:{
      //       name:user.name,
      //     chef:user.chef,
      //     supplier:user.supplier,
      //     category:user.category,
      //     details:user.details,
      //     photo:user.photo
           
      //   }
      // }
      // const result=await useCollection.updateOne(filter,updatCoffee,options)
      // res.send(result)
    })
    

    // ------------------------------
    // DELETE ----------
    app.delete('/coffee/:id',async(req,res)=>{
      const id = req.params.id;
      const quary={_id:new ObjectId(id)}
      const result=await useCollection.deleteOne(quary)
      res.send(result)
    })
    // -----------------------

    //  This is a post Convesion ----------------
    app.post("/coffee", async (req, res) => {
      const newCoffee = req.body;
      console.log(newCoffee);
      const result = await useCollection.insertOne(newCoffee);
      res.send(result);
    });
    // ---------Post-End--------------------------
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.log);

// ------------------------

app.get("/", async (req, res) => {
  res.send("Coffe making server is running");
});

app.listen(port, () => {
  console.log(`The Server is Ruinnge ${port}`);
});
