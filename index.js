import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import productRoutes from "./routes/productRoutes.js";

dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

mongoose.connect(`${process.env.MONGO_URI}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
    console.log("Connected to MongoDB");
});
app.get("/", (req, res) => {
  res.send("That was a success")
});
app.use("/api/products", productRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
