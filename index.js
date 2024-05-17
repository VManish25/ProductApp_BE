import express from "express";
import { MongoClient } from "mongodb";
import  * as dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const app = express();
app.use((cors));
const PORT = 5000;

//console.log(process.env.MONGO_URL);

// Mongodb connection
const MONGO_URL = process.env.MONGO_URL;
async function createConnection() {
    const client = new MongoClient(MONGO_URL);
    await client.connect();
    console.log("Mongodb is Connected");
    return client;
}
const client = await createConnection();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.get("/products", async (req, res) => {
    const product = await client
    .db("product_app")
    .collection("products")
    .find()
    .toArray();
    res.send(product);
});

//get product by ID
app.get("/products/:id", async (req,res) => {
    const { id } = req.params;
    const product = await client
    .db("product_app")
    .collection("products")
    .findOne({id: id});
    res.send(product);
});


//delete product by ID
app.delete("/products/:id", async (req,res) => {
    const { id } = req.params;
    const product = await client
    .db("product_app")
    .collection("products")
    .deleteOne({id: id});
    res.send(product);
});


//add product
app.post("/products", async (req,res) => {
    const newProduct = req.body;
    const result = await client
    .db("product_app")
    .collection("products")
    .insertMany(newProduct);
    res.send(result);
});

//update products
app.put("/products/:id", async (req,res) => {
    const { id } = req.params;
    const updatedProduct = req.body;
    const result = await client
    .db("product_app")
    .collection("products")
    .updateOne({ id: id}, { $set: updatedProduct });
    res.send(result);
});


app.listen(PORT, () => console.log("Server started on the port", PORT));