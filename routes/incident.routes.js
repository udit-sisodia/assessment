import express from "express"
const router = express.Router();

import incidentModel from "../model/incident.model.js"
// POST API - Create a new incident
router.post("/", async (req, res) => {
    try {
        const incident = await incidentModel.create(req.body);

        res.status(201).json({
            success: true,
            message: "Incident created successfully",
            data: incident,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

router.get("/", async (req, res) => {
    try {
        const incidents = await incidentModel.find();

        res.status(200).json({
            success: true,
            count: incidents.length,
            data: incidents,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch incidents",
            error: error.message,
        });
    }
});

// POST API - Get incidents by state (case-insensitive)
router.post("/search-by-state", async (req, res) => {
    try {
        const { state, status } = req.body;

        if (!state || !state.trim() || !status || !status.trim()) {
            return res.status(400).json({
                success: false,
                message: "Both state and status are required",
            });
        }

        const escapedState = state.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const escapedStatus = status.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        const incidents = await incidentModel.find({
            state: {
                $regex: `^${escapedState}$`,
                $options: "i",
            },
            status: {
                $regex: `^${escapedStatus}$`,
                $options: "i",
            },
        });

        if (incidents.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No incidents found for the given state and status",
            });
        }

        res.status(200).json({
            success: true,
            count: incidents.length,
            data: incidents,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch incidents",
            error: error.message,
        });
    }
});

// POST API - Search incidents by description or establishment
router.post("/search", async (req, res) => {
    try {
        const { search } = req.body;

        if (!search || !search.trim()) {
            return res.status(400).json({
                success: false,
                message: "Search keyword is required",
            });
        }

        const words = search.trim().split(/\s+/);

        // Escape special regex characters
        const escapedWords = words.map((word) =>
            word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        );

        // Every word must match, but can match either field
        const conditions = escapedWords.map((word) => ({
            $or: [{ description: { $regex: word, $options: "i" } }, { establishment: { $regex: word, $options: "i" } }, { severity: { $regex: `^${word}$`, $options: "i" } },],
        }));

        const incidents = await incidentModel.find({
            $and: conditions,
        });

        return res.status(200).json({
            success: true,
            count: incidents.length,
            message:
                incidents.length > 0
                    ? "Search results fetched successfully"
                    : "No matching incidents found",
            data: incidents,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to search incidents",
            error: error.message,
        });
    }
});



export default router