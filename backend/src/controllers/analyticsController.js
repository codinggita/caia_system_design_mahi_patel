// analytics
 const Designs = require("../models/models");
const SearchQuery = require("../models/searchQueryModel");
const mongoose = require("mongoose");

const getTotalConcepts = async (req, res) => {
    try {
        const total = await Designs.countDocuments();
        res.status(200).json({ msg: "success", data: { total } });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const getCategoryDistribution = async (req, res) => {
    try {
        const distribution = await Designs.aggregate([
            { $group: { _id: "$metadata.category", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        res.status(200).json({ msg: "success", data: distribution });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const getDifficultyStats = async (req, res) => {
    try {
        const stats = await Designs.aggregate([
            { $group: { _id: "$metadata.difficulty", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        res.status(200).json({ msg: "success", data: stats });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const getTopPatterns = async (req, res) => {
    try {
        const patterns = await Designs.aggregate([
            { $match: { "metadata.design_pattern": { $ne: "" } } },
            { $group: { _id: "$metadata.design_pattern", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);
        res.status(200).json({ msg: "success", data: patterns });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const getTopLanguages = async (req, res) => {
    try {
        const languages = await Designs.aggregate([
            { $match: { "metadata.language": { $ne: "" }, "metadata.language": { $exists: true } } },
            { $group: { _id: "$metadata.language", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);
        res.status(200).json({ msg: "success", data: languages });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const getTopViewed = async (req, res) => {
    try {
        const concepts = await Designs.find({}, { prompt: 1, "metadata.views": 1, "metadata.concept": 1 })
            .sort({ "metadata.views": -1 })
            .limit(10);
        res.status(200).json({ msg: "success", data: concepts });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const getTopBookmarked = async (req, res) => {
    try {
        const concepts = await Designs.find({ isBookmarked: true }, { prompt: 1, "metadata.views": 1, "metadata.concept": 1 })
            .sort({ "metadata.views": -1 })
            .limit(10);
        res.status(200).json({ msg: "success", data: concepts });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const getTrendingAnalytics = async (req, res) => {
    try {
        const trendingCount = await Designs.countDocuments({ "metadata.isTrending": true });
        const trendingConcepts = await Designs.find({ "metadata.isTrending": true }, { prompt: 1, "metadata.views": 1, "metadata.concept": 1 })
            .sort({ "metadata.views": -1 })
            .limit(5);
        res.status(200).json({ 
            msg: "success", 
            data: { 
                totalTrending: trendingCount, 
                topTrending: trendingConcepts 
            } 
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const getMonthlyGrowth = async (req, res) => {
    try {
        const growth = await Designs.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: "$metadata.generated_at" },
                        month: { $month: "$metadata.generated_at" }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);
        
        // Format the output
        const formattedGrowth = growth.map(item => ({
            month: `${item._id.year}-${String(item._id.month).padStart(2, '0')}`,
            newConcepts: item.count
        }));
        
        res.status(200).json({ msg: "success", data: formattedGrowth });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const getTopSearches = async (req, res) => {
    try {
        const topSearches = await SearchQuery.find()
            .sort({ count: -1 })
            .limit(10);
        res.status(200).json({ msg: "success", data: topSearches });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};
