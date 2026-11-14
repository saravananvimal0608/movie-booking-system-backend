import User from '../models/userModel.js'
import { sendOtp } from '../utils/sendOtp.js'
import jwt from 'jsonwebtoken'

export const getUsers = async (req, res) => {
    try {
        const user = await User.find();

        if (user.length === 0) {
            return res.status(200).json({ message: "No User Found", data: [], success: true })
        }

        return res.status(200).json({ message: "User Fetched Successfully", data: user, success: true })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message, stack: error.stack })
    }
}

export const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, gender, dob } = req.body

        if (!firstName || !lastName || !email || !gender || !dob) {
            return res.status(400).json({ message: "All fields are required", success: false })
        }

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email", success: false })
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000)

        const user = await User.create({ firstName, lastName, email, gender, dob, otp, otpExpiry })

        try {
            await sendOtp(email, otp)
        } catch (emailError) {
            await User.findByIdAndDelete(user._id)
            return res.status(502).json({ message: "Failed to send OTP email", error: emailError.message, success: false })
        }

        return res.status(201).json({ message: "OTP sent to your email", userId: user._id, success: true })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message, stack: error.stack })
    }
}

export const verifyOtp = async (req, res) => {
    try {
        const { userId, otp } = req.body

        if (!userId || !otp) {
            return res.status(400).json({ message: "userId and otp are required", success: false })
        }

        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false })
        }

        if (user.otp !== otp || user.otpExpiry < new Date()) {
            return res.status(400).json({ message: "Invalid or expired OTP", success: false })
        }

        user.isEmailVerified = true
        user.otp = undefined
        user.otpExpiry = undefined
        await user.save()

        return res.status(200).json({ message: "Email verified successfully", success: true })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message, stack: error.stack })
    }
}

export const loginSendOtp = async (req, res) => {
    try {
        const { email } = req.body

        if (!email) {
            return res.status(400).json({ message: "Email is required", success: false })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: "User not found with this email", success: false })
        }

        if (!user.isEmailVerified) {
            return res.status(403).json({ message: "Email not verified. Please complete registration.", success: false })
        }

        if (user.status !== 'ACTIVE') {
            return res.status(403).json({ message: "Your account is inactive or blocked", success: false })
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString()
        const otpExpiry = new Date(Date.now() + 5 * 60 * 1000)

        user.otp = otp
        user.otpExpiry = otpExpiry
        await user.save()

        try {
            await sendOtp(email, otp)
        } catch (emailError) {
            return res.status(502).json({ message: "Failed to send OTP email", error: emailError.message, success: false })
        }

        return res.status(200).json({ message: "OTP sent to your email", success: true })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message, stack: error.stack })
    }
}

export const loginVerifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body

        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required", success: false })
        }

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false })
        }

        if (user.otp !== otp || user.otpExpiry < new Date()) {
            return res.status(400).json({ message: "Invalid or expired OTP", success: false })
        }

        user.otp = undefined
        user.otpExpiry = undefined
        await user.save()

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        return res.status(200).json({
            message: "Login successful",
            token,
            user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role },
            success: true
        })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message, stack: error.stack })
    }
}
