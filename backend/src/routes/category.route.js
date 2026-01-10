import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createCategory, getCategories, updateCategory, deleteCategory } from "../controllers/category.controller.js";
import { requireAccess } from "../middleware/requireAccess.middleware.js";

const router = express.Router();

router.get("/", getCategories);
router.post("/", protectRoute, requireAccess, createCategory);
router.put("/:id", protectRoute, requireAccess, updateCategory); 
router.delete("/:id", protectRoute, requireAccess, deleteCategory);

export default router;