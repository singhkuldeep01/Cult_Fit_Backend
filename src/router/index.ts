import { Router } from "express";
import authRoutes from './auth.route'
import gymCenterRoutes from './center.route'
import classTemplateRoutes from './classTemplate.route'
import classSessionRoutes from './classSession.route'
import holidayRoutes from './holiday.route'

const router = Router();

router.use('/auth' , authRoutes);
router.use('/center', gymCenterRoutes);
router.use('/class-template', classTemplateRoutes);
router.use('/class-session', classSessionRoutes);
router.use('/center-holiday', holidayRoutes);

export default router;