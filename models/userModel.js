import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required: true,
        trim: true
    },

    lastName: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    password: {
        type: String,
    },

    status: {
        type: String,
        enum: ['ACTIVE', 'INACTIVE', 'BLOCKED'],
        default: 'ACTIVE'
    },

    dob: Date,

    gender: {
        type: String,
        enum: ['Male', 'Female', 'Others']
    },

    role: {
        type: String,
        enum: ['SUPER_ADMIN', 'TheatreOwner', 'USER'],
        default: 'USER'
    },

    isEmailVerified: {
        type: Boolean,
        default: false
    },

    otp: String,

    otpExpiry: Date,

}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
