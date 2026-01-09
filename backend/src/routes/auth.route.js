import express from "express";
import { createUser, login, logout, updateProfile, checkAuth, getAllUsers, updateUser, deleteUser, getStaffList, getUserById } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", createUser);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update-profile", protectRoute, updateProfile);

router.get("/check-auth", protectRoute, checkAuth);
router.get("/staff-list", protectRoute, getStaffList);

// CRUD operations for users
router.get("/users/get-all", protectRoute, getAllUsers);
router.post("/users/create", protectRoute, createUser);
router.put("/users/update/:id", protectRoute, updateUser);
router.delete("/users/delete/:id", protectRoute, deleteUser);

router.get("/users/:id", protectRoute, getUserById);

export default router;