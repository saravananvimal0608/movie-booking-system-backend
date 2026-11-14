import express from 'express'
import authMiddleware from '../middleware/auth.js'
import TheatreOwner from '../middleware/theatreOwnerMiddleware.js';
import upload from '../middleware/upload.js'
import { createTheatre, getSingleTheatre, getTheatres, updateTheatre, deleteTheatre } from '../controllers/theatreController.js';
import superAdminMiddleware from '../middleware/superAdminMiddleware.js';

const router = express.Router();

router.post('/add', authMiddleware, TheatreOwner, upload.array('images', 5), createTheatre);
router.put('/update/:id', authMiddleware, TheatreOwner, upload.array('images', 5), updateTheatre);
router.delete('/delete/:id', authMiddleware, TheatreOwner, deleteTheatre);
router.get('/getSingleTheatre/:id', authMiddleware, TheatreOwner, getSingleTheatre)

// For super admin to get all theatres
router.get('/getSingleTheatreadmin/:id', authMiddleware, superAdminMiddleware, getSingleTheatre)
router.get('/getalltheatre', authMiddleware, superAdminMiddleware, getTheatres);

export default router
