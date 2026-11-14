import Screen from '../models/screenModel.js'


export const createScreen = async (req, res) => {
    try {
        const { theatreId, screenName, totalSeats, totalRows, totalColumns } = req.body

        if (!theatreId || !screenName || !totalSeats || !totalRows || !totalColumns) {
            return res.status(400).json({
                message: "All fields are required",
                success: false,
            })
        }
        const screen = await Screen.create({
            theatreId, screenName, totalSeats, totalRows, totalColumns
        })

        return res.status(201).json({
            message: "Screen created successfully",
            data: screen,
        })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message, stack: error.stack })

    }
}

export const updateScreen = async (req, res) => {
    try {
        const { id } = req.params

        const screen = await Screen.findById(id)
        if (!screen) {
            return res.status(404).json({ message: "Screen not found", success: false })
        }

        const { screenName, screenType, totalSeats, totalRows, totalColumns, status } = req.body

        const updatedData = {
            ...(screenName && { screenName }),
            ...(screenType && { screenType }),
            ...(totalSeats && { totalSeats }),
            ...(totalRows && { totalRows }),
            ...(totalColumns && { totalColumns }),
            ...(status && { status })
        }

        const updated = await Screen.findByIdAndUpdate(id, updatedData, { new: true })

        return res.status(200).json({ message: "Screen updated successfully", data: updated, success: true })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message, stack: error.stack })
    }
}

export const deleteScreen = async (req, res) => {
    try {
        const { id } = req.params

        const screen = await Screen.findById(id)
        if (!screen) {
            return res.status(404).json({ message: "Screen not found", success: false })
        }

        await Screen.findByIdAndDelete(id)

        return res.status(200).json({ message: "Screen deleted successfully", success: true })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message, stack: error.stack })
    }
}

export const getScreensByTheatreId = async (req, res) => {
    try {
        const { id } = req.params

        const screens = await Screen.find({
            theatreId: id
        })

        if (screens.length === 0) {
            return res.status(200).json({
                message: "No screens found for this theatre",
                data: [],
            })
        }
        return res.status(200).json({
            message: "Screens retrieved successfully",
            data: screens,
        })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message, stack: error.stack })
    }
}