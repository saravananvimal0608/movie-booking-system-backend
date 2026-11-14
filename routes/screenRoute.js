import express from 'express'
import authMiddleware from '../middleware/auth.js';
import theatreOwner from '../middleware/theatreOwnerMiddleware.js';
import { createScreen, getScreensByTheatreId, updateScreen, deleteScreen } from '../controllers/screenController.js';
import superAdminMiddleware from '../middleware/superAdminMiddleware.js';


const router = express.Router();

router.post('/addscreen', authMiddleware, theatreOwner, createScreen);
router.put('/update/:id', authMiddleware, theatreOwner, updateScreen);
router.delete('/delete/:id', authMiddleware, theatreOwner, deleteScreen);
router.get('/getScreensByTheatreId/:id', authMiddleware, theatreOwner, getScreensByTheatreId);

// For super admin to get screens by theatre id
router.get('/getScreensByTheatreIdForAdmin/:id', authMiddleware, superAdminMiddleware, getScreensByTheatreId);

export default router;
