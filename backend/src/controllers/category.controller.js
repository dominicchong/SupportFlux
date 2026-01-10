import Category from "../models/category.model.js";

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .populate("createdBy", "fullName")
      .collation({ locale: "en", strength: 2 })
      .sort({ category: 1 });

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Add a new category
export const createCategory = async (req, res) => {
  try {
    const { category } = req.body;
    const cleanCategory = category?.trim();

    if (!cleanCategory) {
      return res.status(400).json({ message: "Category is required" });
    }

    if (cleanCategory.length > 30) {
      return res.status(400).json({ message: "Category name is too long"});
    }

    const existingCategory = await Category.findOne({
      category: { $regex: new RegExp(`^${cleanCategory}$`, "i") }
    });

    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const newCategory = new Category({
      category: cleanCategory,
      createdBy: req.user._id,
    });

    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    console.error("Error in createCategory:", error.message);
    res.status(500).json({ message: "Failed to create category" });
  }
};

// Update category details
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { category } = req.body;
    const cleanCategory = category?.trim();

    if (!cleanCategory) {
      return res.status(400).json({ message: "Category is required" });
    }

    // Duplicate check - Ensure the new category isn't taken by a DIFFERENT ID
    const duplicate = await Category.findOne({
      category: { $regex: new RegExp(`^${cleanCategory}$`, "i") },
      _id: { $ne: id } // existing ID not equal to this current category ID
    });

    if (duplicate) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { category: cleanCategory, updatedBy: req.user._id },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    // If not found, return error immediately
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await Category.findByIdAndDelete(id);
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error in deleteCategory:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};