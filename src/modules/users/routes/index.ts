import { Router } from "express";
import { validateUser } from "../../../middleware/validations/userValidation";
import { getAllUsers, registerUser } from "../services/user.service";
import {
  createUserController,
  getUsersController,
} from "../controllers/user.controller";

const userService = {
  getAllUsers,
  registerUser,
};

const router = Router();

router.post("/", validateUser, createUserController(userService));
router.get("/", getUsersController(userService));

export default router;
