import express from "express";
import * as productController from "../controllers/productController.js";

const router = express.Router();

// Create a new product
router.post("/", productController.createProduct);

// Get all products
router.get("/", productController.getAllProducts);
// Search products
router.get("/search/:key", productController.searchProducts);

// Get a specific product by ID
router.get("/:id", productController.getProductById);

// Update a product
router.put("/:id", productController.updateProduct);

// Delete a product
router.delete("/:id", productController.deleteProduct);

export default router;
