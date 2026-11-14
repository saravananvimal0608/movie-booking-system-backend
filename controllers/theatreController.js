import Theatre from "../models/theatreModel.js";



export const createTheatre = async (req, res) => {
    try {
        const userId = req.user.id;

        const images = req.files?.map(file => file.path) || [];

        const { theatreName, description, address, location, facilities } = req.body;

        if (!theatreName || !address || !location || !facilities || !images || !description) {
            res.status(400).json({
                message: "All fields are required",
                success: false,
            })
        }

        const theatre = await Theatre.create({
            userId,
            theatreName,
            description,
            address: JSON.parse(address),
            location: JSON.parse(location),
            facilities: JSON.parse(facilities),
            images
        })
        res.status(201).json({
            message: "Theatre added successfully",
            success: true,
            data: theatre
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
            stack: error.stack
        })

    }
}

export const getTheatres = async (req, res) => {
    try {
        const theatres = await Theatre.find().populate('userId', 'name email')

        if (theatres.length === 0) {
            return res.status(200).json({
                message: "no theatre found",
                data: [],
                success: true
            })
        }
        res.status(200).json({
            message: "Theatres fetched successfully",
            data: theatres,
            success: true
        })

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message, stack: error.stack })
    }
}

export const updateTheatre = async (req, res) => {
    try {
        const { id } = req.params
        const ownerId = req.user.id

        const theatre = await Theatre.findById(id)
        if (!theatre) {
            return res.status(404).json({ message: "Theatre not found", success: false })
        }

        if (theatre.ownerId.toString() !== ownerId) {
            return res.status(403).json({ message: "Not authorized to update this theatre", success: false })
        }

        const { theatreName, description, address, location, facilities } = req.body

        const newImages = req.files?.map(file => file.path) || []

        const updatedData = {
            ...(theatreName && { theatreName }),
            ...(description && { description }),
            ...(address && { address: JSON.parse(address) }),
            ...(location && { location: JSON.parse(location) }),
            ...(facilities && { facilities: JSON.parse(facilities) }),
            ...(newImages.length > 0 && { images: newImages })
        }

        const updated = await Theatre.findByIdAndUpdate(id, updatedData, { new: true })

        res.status(200).json({ message: "Theatre updated successfully", data: updated, success: true })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message, stack: error.stack })
    }
}

export const deleteTheatre = async (req, res) => {
    try {
        const { id } = req.params
        const ownerId = req.user.id

        const theatre = await Theatre.findById(id)
        if (!theatre) {
            return res.status(404).json({ message: "Theatre not found", success: false })
        }

        if (theatre.ownerId.toString() !== ownerId) {
            return res.status(403).json({ message: "Not authorized to delete this theatre", success: false })
        }

        await Theatre.findByIdAndDelete(id)

        res.status(200).json({ message: "Theatre deleted successfully", success: true })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message, stack: error.stack })
    }
}

export const getSingleTheatre = async (req, res) => {
    try {
        const { id } = req.params

        if (!id) {
            return res.status(400).json({
                message: "Theatre id is required",
                success: false
            })
        }
        const theatre = await Theatre.findById(id).populate('userId', 'name email')

        if (!theatre) {
            return res.status(404).json({
                message: "Theatre not found",
                success: false
            })
        }
        res.status(200).json({
            message: "Theatre fetched successfully",
            data: theatre,
            success: true
        })
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message, stack: error.stack })
    }
}