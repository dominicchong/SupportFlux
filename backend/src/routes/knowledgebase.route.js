import { Router } from "express";
import { getAllKnowledge, createKnowledge, updateKnowledge, deleteKnowledge } from "../controllers/knowledgebase.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { requireStaff } from "../middleware/requireStaff.middleware.js";

const router = Router();

router.get("/", getAllKnowledge);
router.post("/create", protectRoute, requireStaff, createKnowledge);
router.put("/update/:id", protectRoute, requireStaff, updateKnowledge);
router.delete("/delete/:id", protectRoute, requireStaff, deleteKnowledge);

export default router;
