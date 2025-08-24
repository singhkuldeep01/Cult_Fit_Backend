import { Router } from "express";
import authRoutes from './auth.route'
import gymCenterRoutes from './center.route'
const router = Router();

router.use('/auth' , authRoutes);
router.use('/center', gymCenterRoutes);

export default router;