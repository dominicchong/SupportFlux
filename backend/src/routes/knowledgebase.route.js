import { Router } from "express";
import { getAllKnowledge, createKnowledge, updateKnowledge, deleteKnowledge } from "../controllers/knowledgebase.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { requireAccess } from "../middleware/requireAccess.middleware.js";

const router = Router();

router.get("/", getAllKnowledge);
router.post("/create", protectRoute, requireAccess, createKnowledge);
router.put("/update/:id", protectRoute, requireAccess, updateKnowledge);
router.delete("/delete/:id", protectRoute, requireAccess, deleteKnowledge);

export default router;
