import { Router } from "express";
import { create, getAll, login, remove } from "../controllers/user.controller";
import { verifierId } from "../middlewares/verifier-id";

const router = Router();

router.get("/", getAll);
router.post("/", create);
router.post("/login", login);
router.delete("/:id", verifierId, remove);

export default router;
