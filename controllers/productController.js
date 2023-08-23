import Product from "../models/productSchema.js";

// Controller to create a new product
export const createProduct = async (req, res) => {
    const newProduct = await Product.create(req.body);
    try {
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: "Failed to create product" });
    }
};

// Controller to get all products
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve products" });
    }
};

// Controller to get a specific product by ID
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).sort({
            createdAt: -1
        });
        if (!product) {
            res.status(404).json({ error: "Product not found" });
            return;
        }
        const { __v, createdAt, ...productData } = product._doc;
        res.status(200).json(productData);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve product" });
    }
};
export const searchProducts = async (req, res) => {
    try {
        const result = await Product.aggregate([
            {
                $search: {
                    index: "products",
                    text: {
                        query: req.params.key,
                        path: {
                            wildcard: "*"
                        }
                    }
                }
            }
        ]);
        if (!result) {
            res.status(404).json({ error: "Nothing found" });
            return;
        }
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve product" });
    }
};

// Controller to update a product
export const updateProduct = async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedProduct) {
            res.status(404).json({ error: "Product not found" });
            return;
        }
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: "Failed to update product" });
    }
};

// Controller to delete a product
export const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndRemove(req.params.id);
        if (!deletedProduct) {
            res.status(404).json({ error: "Product not found" });
            return;
        }
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: "Failed to delete product" });
    }
};