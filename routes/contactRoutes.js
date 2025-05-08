import express from 'express';
import { sendContactMessage } from '../controllers/contactController.js';

const router = express.Router();

router.route('/').post(sendContactMessage);

export default router;