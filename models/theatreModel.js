
import mongoose from 'mongoose'

const theatreSchema = new mongoose.Schema({
    
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },

    theatreName: {
        type: String,
        required: true,
        trim: true
    },

    description: String,

    address: {
        street: String,
        area: String,
        city: {
            type: String,
            required: true
        },
        state: String,
        pincode: String,
        country: {
            type: String,
            default: 'India'
        }
    },

    location: {
        latitude: Number,
        longitude: Number
    },

    facilities: [{
        type: String
    }],

    images: [{
        type: String
    }],

    status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE', 'PENDING'],
        default: 'PENDING'
    }

}, { timestamps: true })

const Theatre = mongoose.model('Theatre', theatreSchema)

export default Theatre
