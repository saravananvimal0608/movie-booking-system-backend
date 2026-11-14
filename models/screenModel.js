
import mongoose from 'mongoose'

const screenSchema = new mongoose.Schema({
    theatreId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Theatre',
        required: true,
        index: true
    },

    screenName: {
        type: String,
        required: true
    },

    screenType: {
        type: String,
        enum: ['2D', '3D', 'IMAX', '4DX', 'DOLBY'],
        default: '2D'
    },

    totalSeats: {
        type: Number,
        required: true
    },

    totalRows: {
        type: Number,
        required: true
    },

    totalColumns: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE'],
        default: 'ACTIVE'
    }

}, { timestamps: true })

const Screen = mongoose.model('Screen', screenSchema)

export default Screen
