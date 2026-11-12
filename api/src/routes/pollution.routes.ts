import { Router } from "express";
import { create, getAll, getById, remove, update } from "../controllers/pollution.controller";
import { verifierId } from "../middlewares/verifier-id";

const router = Router();

router.get("/", getAll);
router.get("/:id", verifierId, getById);
router.post("/", create);
router.put("/:id", verifierId, update);
router.delete("/:id", verifierId, remove);

export default router;
