import { Router } from "express";
import { create, getAll, login, remove } from "../controllers/user.controller";

const router = Router();

router.get("/", getAll);
router.post("/", create);
router.post("/login", login);
router.delete("/:id", remove);

export default router;
