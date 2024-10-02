import { Router } from "express";
import userRoutes from "../modules/users/routes";
import reservationRoutes from "../modules/reservations/routes";

const router = Router();

router.use("/users", userRoutes);
router.use("/reservations", reservationRoutes);

export default router;
