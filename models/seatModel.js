
import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema({

    screenId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Screen',
        required: true
    },

    rowName: {
        type: String,
        required: true
    },

    seatNumber: {
        type: Number,
        required: true
    },

    seatLabel: {
        type: String,
        required: true
    },

    seatType: {
        type: String,
        enum: ['NORMAL', 'BALCONY', 'PREMIUM', 'RECLINER'],
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }

}, { timestamps: true });

seatSchema.index(
    { screenId: 1, seatLabel: 1 },
    { unique: true }
);

const Seat = mongoose.model('Seat', seatSchema);

export default Seat;
