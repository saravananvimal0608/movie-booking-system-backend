import Seat from '../models/seatModel.js'
import Screen from '../models/screenModel.js'

export const createSeats = async (req, res) => {
    try {
        const { screenId, rows } = req.body;

        if (!screenId || !rows || !Array.isArray(rows) || rows.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Screen ID and rows are required"
            });
        }

        const screen = await Screen.findById(screenId);

        if (!screen) {
            return res.status(404).json({
                success: false,
                message: "Screen not found"
            });
        }

        const seats = [];

        for (const row of rows) {
            const { rowName, seatCount, seatType, price } = row;

            if (
                !rowName ||
                !Number.isInteger(seatCount) ||
                seatCount <= 0 ||
                !seatType ||
                price === undefined ||
                price < 0
            ) {
                return res.status(400).json({
                    success: false,
                    message: `Invalid configuration for row ${rowName}`
                });
            }

            for (let i = 1; i <= seatCount; i++) {
                seats.push({
                    screenId,
                    rowName,
                    seatNumber: i,
                    seatLabel: `${rowName}${i}`,
                    seatType,
                    price
                });
            }
        }

        const createdSeats = await Seat.insertMany(seats, {
            ordered: true
        });

        return res.status(201).json({
            success: true,
            message: "Seats created successfully",
            totalSeats: createdSeats.length,
            data: createdSeats
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Seat creation failed",
            error: error.message
        });
    }
};

export const getSeatsByScreenId = async (req, res) => {
    try {
        const { screenId } = req.params

        const seats = await Seat.find({ screenId }).sort({ rowName: 1, seatNumber: 1 })

        if (seats.length === 0) {
            return res.status(200).json({ message: "No seats found for this screen", data: [], success: true })
        }

        return res.status(200).json({ message: "Seats fetched successfully", data: seats, success: true })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message, stack: error.stack })
    }
}

export const updateSeat = async (req, res) => {
    try {
        const { id } = req.params

        const seat = await Seat.findById(id)
        if (!seat) {
            return res.status(404).json({ message: "Seat not found", success: false })
        }

        const { seatType, price, isActive } = req.body

        const updatedData = {
            ...(seatType && { seatType }),
            ...(price !== undefined && { price }),
            ...(isActive !== undefined && { isActive })
        }

        const updated = await Seat.findByIdAndUpdate(id, updatedData, { new: true })

        return res.status(200).json({ message: "Seat updated successfully", data: updated, success: true })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message, stack: error.stack })
    }
}

export const deleteSeat = async (req, res) => {
    try {
        const { id } = req.params

        const seat = await Seat.findById(id)
        if (!seat) {
            return res.status(404).json({ message: "Seat not found", success: false })
        }

        await Seat.findByIdAndDelete(id)

        return res.status(200).json({ message: "Seat deleted successfully", success: true })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message, stack: error.stack })
    }
}

export const deleteSeatsByScreenId = async (req, res) => {
    try {
        const { screenId } = req.params

        const result = await Seat.deleteMany({ screenId })

        return res.status(200).json({ message: `${result.deletedCount} seats deleted successfully`, success: true })
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message, stack: error.stack })
    }
}
