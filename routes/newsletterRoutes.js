import express from 'express';
import { subscribeToNewsletter } from '../controllers/newsletterController.js';

const router = express.Router();

router.route('/').post(subscribeToNewsletter);

export default router;