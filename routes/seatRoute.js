import express from 'express'
import authMiddleware from '../middleware/auth.js'
import theatreOwner from '../middleware/theatreOwnerMiddleware.js'
import { createSeats, getSeatsByScreenId, updateSeat, deleteSeat, deleteSeatsByScreenId } from '../controllers/seatController.js'

const router = express.Router()

router.post('/create', authMiddleware, theatreOwner, createSeats)
router.get('/screen/:screenId', authMiddleware, getSeatsByScreenId)
router.put('/update/:id', authMiddleware, theatreOwner, updateSeat)
router.delete('/delete/:id', authMiddleware, theatreOwner, deleteSeat)
router.delete('/deleteAll/:screenId', authMiddleware, theatreOwner, deleteSeatsByScreenId)

export default router
