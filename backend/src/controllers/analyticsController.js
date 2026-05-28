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







const getFailedSearches = async (req, res) => {
    try {
        // Proxy for failed searches: queries that have only been searched exactly once (count: 1)
        const failedProxies = await SearchQuery.find({ count: 1 })
            .sort({ lastSearchedAt: -1 })
            .limit(15);
        res.status(200).json({ msg: "success", data: failedProxies });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const getEngagement = async (req, res) => {
    try {
        const engagementStats = await Designs.aggregate([
            {
                $group: {
                    _id: null,
                    totalViews: { $sum: "$metadata.views" },
                    avgViews: { $avg: "$metadata.views" },
                    totalBookmarks: {
                        $sum: { $cond: [{ $eq: ["$isBookmarked", true] }, 1, 0] }
                    }
                }
            }
        ]);
        
        res.status(200).json({ msg: "success", data: engagementStats[0] || { totalViews: 0, avgViews: 0, totalBookmarks: 0 } });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const getApiPerformance = async (req, res) => {
    try {
        // Mocked APM data
        const performance = {
            averageResponseTime: "45ms",
            uptime: "99.98%",
            activeConnections: Math.floor(Math.random() * 500) + 100,
            requestsPerMinute: Math.floor(Math.random() * 2000) + 500,
            errorRate: "0.12%"
        };
        res.status(200).json({ msg: "success", data: performance });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const getDatabasePerformance = async (req, res) => {
    try {
        // We can fetch real DB stats using mongoose.connection.db.stats()
        if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
            const dbStats = await mongoose.connection.db.stats();
            res.status(200).json({ msg: "success", data: dbStats });
        } else {
            res.status(500).json({ msg: "Database connection not ready" });
        }
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const getCacheHitRate = async (req, res) => {
    try {
        // Mocked Cache metrics
        const hitRate = (Math.random() * (95 - 80) + 80).toFixed(2); // Random between 80% and 95%
        const cacheMetrics = {
            cacheHitRate: `${hitRate}%`,
            cacheMisses: Math.floor(Math.random() * 500),
            memoryUsage: "256MB",
            evictions: Math.floor(Math.random() * 100)
        };
        res.status(200).json({ msg: "success", data: cacheMetrics });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

module.exports = {
    getTotalConcepts,
    getCategoryDistribution,
    getDifficultyStats,
    getTopPatterns,
    getTopLanguages,
    getTopViewed,
    getTopBookmarked,
    getTrendingAnalytics,
    getMonthlyGrowth,
    getTopSearches,
    getFailedSearches,
    getEngagement,
    getApiPerformance,
    getDatabasePerformance,
    getCacheHitRate
};

