const Designs = require("../models/models");
const SearchQuery = require("../models/searchQueryModel");
const Note = require("../models/noteModel");

const logSearchQuery = async (query) => {
    if (!query) return;
    try {
        await SearchQuery.findOneAndUpdate(
            { query: query.toLowerCase() },
            { $inc: { count: 1 }, $set: { lastSearchedAt: Date.now() } },
            { upsert: true, new: true }
        );
    } catch (err) {
        console.error("Error logging search query:", err);
    }
};


const getConceptById = async (req, res) => {
    try {
        // Increment views by 1 every time a concept is fetched by ID
        const concept = await Designs.findByIdAndUpdate(
            req.params.id,
            { $inc: { "metadata.views": 1 } },
            { new: true }
        );

        if (!concept) {
            return res.status(404).json({ msg: "Concept not found" });
        }
        res.status(200).json({ msg: "success", data: concept });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ msg: error.message });
    }
};

const getAll = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 0;
        const { sort } = req.query;
        
        let query = Designs.find();

        if (sort) {
            let sortObj = {};
            switch(sort) {
                case 'title': sortObj = { "metadata.concept": 1 }; break;
                case '-title': sortObj = { "metadata.concept": -1 }; break;
                case '-createdAt': sortObj = { "metadata.generated_at": -1 }; break;
                case 'createdAt': sortObj = { "metadata.generated_at": 1 }; break;
                case 'views': 
                case 'popularity': sortObj = { "metadata.views": -1 }; break;
                case '-views': sortObj = { "metadata.views": 1 }; break;
                case 'bookmarks': sortObj = { "isBookmarked": -1 }; break; 
                case 'difficulty': sortObj = { "metadata.difficulty": 1 }; break;
                case '-difficulty': sortObj = { "metadata.difficulty": -1 }; break;
                case 'category': sortObj = { "metadata.category": 1 }; break;
                case '-category': sortObj = { "metadata.category": -1 }; break;
                case 'language': sortObj = { "metadata.language": 1 }; break;
                case '-language': sortObj = { "metadata.language": -1 }; break;
                case 'updatedAt': sortObj = { "metadata.generated_at": -1 }; break; 
                case '-updatedAt': sortObj = { "metadata.generated_at": 1 }; break;
                default: 
                    // allow generic sorting if the user provides a direct field
                    if (sort.startsWith('-')) {
                        sortObj[sort.substring(1)] = -1;
                    } else {
                        sortObj[sort] = 1;
                    }
                    break;
            }
            query = query.sort(sortObj);
        }

        if (limit > 0) {
            query = query.skip((page - 1) * limit).limit(limit);
        }
        
        const system = await query;
        const total = await Designs.countDocuments();
        
        res.status(200).json({ 
            msg: "success", 
            data: system, 
            count: system.length,
            total,
            page,
            totalPages: limit > 0 ? Math.ceil(total / limit) : 1
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ msg: error.message })
    }
}

const createConcept = async (req, res) => {
    try {
        const concept = await Designs.create(req.body);
        res.status(201).json({ msg: "success", data: concept });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ msg: error.message });
    }
};

const updateConcept = async (req, res) => {
    try {
        const concept = await Designs.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!concept) {
            return res.status(404).json({ msg: "Concept not found" });
        }
        res.status(200).json({ msg: "success", data: concept });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ msg: error.message });
    }
};

const patchConcept = async (req, res) => {
    try {
        const updates = {};

        // Loop through the fields sent in the request body
        for (let key in req.body) {
            if (key === 'metadata' && typeof req.body.metadata === 'object') {
                // If metadata is an object, update its sub-fields (e.g., metadata.category)
                for (let subKey in req.body.metadata) {
                    updates[`metadata.${subKey}`] = req.body.metadata[subKey];
                }
            } else {
                // Otherwise, update the field directly (e.g., prompt)
                updates[key] = req.body[key];
            }
        }

        const concept = await Designs.findByIdAndUpdate(req.params.id, { $set: updates }, {
            new: true,
            runValidators: true,
        });

        if (!concept) {
            return res.status(404).json({ msg: "Concept not found" });
        }
        res.status(200).json({ msg: "success", data: concept });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ msg: error.message });
    }
};

const deleteConcept = async (req, res) => {
    try {
        const concept = await Designs.findByIdAndDelete(req.params.id);
        if (!concept) {
            return res.status(404).json({ msg: "Concept not found" });
        }
        res.status(200).json({ msg: "deleted successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ msg: error.message });
    }
};

const getRandomConcept = async (req, res) => {
    try {
        const concept = await Designs.aggregate([{ $sample: { size: 1 } }]);
        res.status(200).json({ msg: "success", data: concept[0] });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error.message });
    }
};

const getLatestConcepts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;

        const concepts = await Designs.find().sort({ "metadata.generated_at": -1 }).skip((page - 1) * limit).limit(limit);
        const total = await Designs.countDocuments();

        res.status(200).json({ 
            msg: "success", 
            data: concepts,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error.message });
    }
};

const getTrendingConcepts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;

        const concepts = await Designs.find({ "metadata.isTrending": true }).sort({ "metadata.views": -1 }).skip((page - 1) * limit).limit(limit);
        const total = await Designs.countDocuments({ "metadata.isTrending": true });

        res.status(200).json({ 
            msg: "success", 
            data: concepts,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error.message });
    }
};

const getPopularConcepts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;

        const concepts = await Designs.find().sort({ "metadata.views": -1 }).skip((page - 1) * limit).limit(limit);
        const total = await Designs.countDocuments();

        res.status(200).json({ 
            msg: "success", 
            data: concepts,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error.message });
    }
};

const getConceptSummary = async (req, res) => {
    try {
        const concept = await Designs.findById(req.params.id).select("summary prompt metadata.concept");
        if (!concept) {
            return res.status(404).json({ msg: "Concept not found" });
        }
        res.status(200).json({ msg: "success", data: concept });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error.message });
    }
};

const getConceptHistory = async (req, res) => {
    try {
        const concept = await Designs.findById(req.params.id).select("history");
        if (!concept) {
            return res.status(404).json({ msg: "Concept not found" });
        }
        res.status(200).json({ msg: "success", data: concept.history });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error.message });
    }
};

const archiveConcept = async (req, res) => {
    try {
        const concept = await Designs.findByIdAndUpdate(req.params.id, { isArchived: true }, { new: true });
        if (!concept) return res.status(404).json({ msg: "Concept not found" });
        res.status(200).json({ msg: "Archived successfully", data: concept });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error.message });
    }
};

const restoreConcept = async (req, res) => {
    try {
        const concept = await Designs.findByIdAndUpdate(req.params.id, { isArchived: false }, { new: true });
        if (!concept) return res.status(404).json({ msg: "Concept not found" });
        res.status(200).json({ msg: "Restored successfully", data: concept });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error.message });
    }
};

const getRelatedConcepts = async (req, res) => {
    try {
        const concept = await Designs.findById(req.params.id);
        if (!concept) return res.status(404).json({ msg: "Concept not found" });

        const related = await Designs.find({
            "metadata.category": concept.metadata.category,
            _id: { $ne: concept._id }
        }).limit(3);

        res.status(200).json({ msg: "success", data: related });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error.message });
    }
};


const getAllCategories = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 0;

        let categories = await Designs.distinct("metadata.category");
        const total = categories.length;

        if (limit > 0) {
            categories = categories.slice((page - 1) * limit, page * limit);
        }

        res.status(200).json({ 
            msg: "success", 
            data: categories,
            total,
            page,
            totalPages: limit > 0 ? Math.ceil(total / limit) : 1
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error.message });
    }
};

const getCategoryDetails = async (req, res) => {
    try {
        const { category } = req.params;

        // Use case-insensitive search for the category
        const concepts = await Designs.find({
            "metadata.category": { $regex: new RegExp(`^${category}$`, "i") }
        });

        if (concepts.length === 0) {
            return res.status(404).json({
                msg: "No concepts found for this category",
                requestedCategory: category
            });
        }

        const subcategories = [...new Set(concepts.map(c => c.metadata.subcategory))];

        res.status(200).json({
            msg: "success",
            data: {
                category,
                totalConcepts: concepts.length,
                subcategories,
                concepts
            }
        });

    } catch (err) {
        console.error("Error in getCategoryDetails:", err);
        res.status(500).json({ error: err.message });
    }
};

const getConceptsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const concepts = await Designs.find({
            "metadata.category": { $regex: new RegExp(`^${category}$`, "i") }
        });

        if (concepts.length === 0) {
            return res.status(404).json({ msg: "No concepts found for this category" });
        }

        res.status(200).json({ msg: "success", data: concepts });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const getAllSubcategories = async (req, res) => {
    try {
        const subcategories = await Designs.distinct("metadata.subcategory");
        res.status(200).json({ msg: "success", data: subcategories });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const getAllTags = async (req, res) => {
    try {
        const tags = await Designs.distinct("metadata.tags");
        res.status(200).json({ msg: "success", data: tags });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const getConceptsByTag = async (req, res) => {
    try {
        const { tag } = req.params;
        const concepts = await Designs.find({
            "metadata.tags": { $regex: new RegExp(`^${tag}$`, "i") }
        });

        if (concepts.length === 0) {
            return res.status(404).json({ msg: "No concepts found with this tag" });
        }

        res.status(200).json({ msg: "success", data: concepts });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const getAllPatterns = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 0;

        let patterns = await Designs.distinct("metadata.design_pattern");
        const total = patterns.length;

        if (limit > 0) {
            patterns = patterns.slice((page - 1) * limit, page * limit);
        }

        res.status(200).json({ 
            msg: "success", 
            data: patterns,
            total,
            page,
            totalPages: limit > 0 ? Math.ceil(total / limit) : 1
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const getConceptsByPattern = async (req, res) => {
    try {
        const { patternName } = req.params;
        const concepts = await Designs.find({
            "metadata.design_pattern": { $regex: new RegExp(`^${patternName}$`, "i") }
        });

        if (concepts.length === 0) {
            return res.status(404).json({ msg: "No concepts found for this pattern" });
        }

        res.status(200).json({ msg: "success", data: concepts });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const getSupportedLanguages = async (req, res) => {
    try {
        const languages = await Designs.distinct("metadata.language");
        const filtered = languages.filter(lang => lang);
        res.status(200).json({ msg: "success", data: filtered });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const getConceptsByLanguage = async (req, res) => {
    try {
        const { language } = req.params;
        const concepts = await Designs.find({
            "metadata.language": { $regex: new RegExp(`^${language}$`, "i") }
        });

        if (concepts.length === 0) {
            return res.status(404).json({ msg: "No concepts found for this language" });
        }

        res.status(200).json({ msg: "success", data: concepts });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const getDifficultyLevels = async (req, res) => {
    try {
        const levels = await Designs.distinct("metadata.difficulty");
        const filtered = levels.filter(level => level);
        res.status(200).json({ msg: "success", data: filtered });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const getConceptsByDifficulty = async (req, res) => {
    try {
        const { level } = req.params;
        const concepts = await Designs.find({
            "metadata.difficulty": { $regex: new RegExp(`^${level}$`, "i") }
        });

        if (concepts.length === 0) {
            return res.status(404).json({ msg: "No concepts found for this difficulty level" });
        }

        res.status(200).json({ msg: "success", data: concepts });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const getQuestionTypes = async (req, res) => {
    try {
        const types = await Designs.distinct("metadata.question_type");
        const filtered = types.filter(type => type);
        res.status(200).json({ msg: "success", data: filtered });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const getConceptsByQuestionType = async (req, res) => {
    try {
        const { type } = req.params;
        const concepts = await Designs.find({
            "metadata.question_type": { $regex: new RegExp(`^${type}$`, "i") }
        });

        if (concepts.length === 0) {
            return res.status(404).json({ msg: "No concepts found for this question type" });
        }

        res.status(200).json({ msg: "success", data: concepts });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const getMicroservicesConcepts = async (req, res) => {
    try {
        const concepts = await Designs.find({
            $or: [
                { "metadata.category": { $regex: /microservices/i } },
                { "metadata.subcategory": { $regex: /microservices/i } },
                { "metadata.tags": { $regex: /microservices/i } },
                { "metadata.concept": { $regex: /microservices/i } }
            ]
        });

        if (concepts.length === 0) {
            return res.status(404).json({ msg: "No microservices concepts found" });
        }

        res.status(200).json({ msg: "success", data: concepts });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};


const globalSearch = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.status(400).json({ msg: "Query parameter 'q' is required" });

        const regex = new RegExp(q, "i");
        const concepts = await Designs.find({
            $or: [
                { prompt: { $regex: regex } },
                { response: { $regex: regex } },
                { summary: { $regex: regex } },
                { "metadata.concept": { $regex: regex } },
                { "metadata.category": { $regex: regex } },
                { "metadata.subcategory": { $regex: regex } },
                { "metadata.tags": { $regex: regex } },
                { "metadata.design_pattern": { $regex: regex } },
                { "metadata.language": { $regex: regex } },
                { "metadata.difficulty": { $regex: regex } }
            ]
        });
        res.status(200).json({ msg: "success", count: concepts.length, data: concepts });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const searchByTitle = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.status(400).json({ msg: "Query parameter 'q' is required" });

        const regex = new RegExp(q, "i");
        const concepts = await Designs.find({
            $or: [
                { prompt: { $regex: regex } },
                { "metadata.concept": { $regex: regex } }
            ]
        });
        res.status(200).json({ msg: "success", count: concepts.length, data: concepts });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const searchByContent = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.status(400).json({ msg: "Query parameter 'q' is required" });

        const regex = new RegExp(q, "i");
        const concepts = await Designs.find({
            $or: [
                { response: { $regex: regex } },
                { summary: { $regex: regex } }
            ]
        });
        res.status(200).json({ msg: "success", count: concepts.length, data: concepts });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const searchByTags = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.status(400).json({ msg: "Query parameter 'q' is required" });

        const concepts = await Designs.find({
            "metadata.tags": { $regex: new RegExp(q, "i") }
        });
        res.status(200).json({ msg: "success", count: concepts.length, data: concepts });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const searchByPatterns = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.status(400).json({ msg: "Query parameter 'q' is required" });

        const concepts = await Designs.find({
            "metadata.design_pattern": { $regex: new RegExp(q, "i") }
        });
        res.status(200).json({ msg: "success", count: concepts.length, data: concepts });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const searchByLanguage = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.status(400).json({ msg: "Query parameter 'q' is required" });

        const concepts = await Designs.find({
            "metadata.language": { $regex: new RegExp(q, "i") }
        });
        res.status(200).json({ msg: "success", count: concepts.length, data: concepts });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const searchByCategory = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.status(400).json({ msg: "Query parameter 'q' is required" });

        const regex = new RegExp(q, "i");
        const concepts = await Designs.find({
            $or: [
                { "metadata.category": { $regex: regex } },
                { "metadata.subcategory": { $regex: regex } }
            ]
        });
        res.status(200).json({ msg: "success", count: concepts.length, data: concepts });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const searchByDifficulty = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.status(400).json({ msg: "Query parameter 'q' is required" });

        const concepts = await Designs.find({
            "metadata.difficulty": { $regex: new RegExp(q, "i") }
        });
        res.status(200).json({ msg: "success", count: concepts.length, data: concepts });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const fuzzySearch = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.status(400).json({ msg: "Query parameter 'q' is required" });
        await logSearchQuery(q);

        const fuzzyRegexStr = q.split('').join('.*');
        const regex = new RegExp(fuzzyRegexStr, "i");
        
        const concepts = await Designs.find({
            $or: [
                { prompt: { $regex: regex } },
                { "metadata.concept": { $regex: regex } },
                { "metadata.tags": { $regex: regex } }
            ]
        });
        res.status(200).json({ msg: "success", count: concepts.length, data: concepts });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const autocompleteSearch = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.status(400).json({ msg: "Query parameter 'q' is required" });

        const regex = new RegExp(`^${q}`, "i");
        const concepts = await Designs.find({
            $or: [
                { prompt: { $regex: regex } },
                { "metadata.concept": { $regex: regex } },
                { "metadata.tags": { $regex: regex } }
            ]
        }).limit(5).select("prompt metadata.concept metadata.tags");
        
        res.status(200).json({ msg: "success", count: concepts.length, data: concepts });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const getRecentSearches = async (req, res) => {
    try {
        const recent = await SearchQuery.find().sort({ lastSearchedAt: -1 }).limit(10);
        res.status(200).json({ msg: "success", data: recent });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const getPopularSearches = async (req, res) => {
    try {
        const popular = await SearchQuery.find().sort({ count: -1 }).limit(10);
        res.status(200).json({ msg: "success", data: popular });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const voiceSearch = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.status(400).json({ msg: "Query parameter 'q' is required" });
        await logSearchQuery(q);

        const words = q.split(/\s+/).filter(w => w.length > 0);
        const andClauses = words.map(word => ({
            $or: [
                { prompt: { $regex: new RegExp(word, "i") } },
                { response: { $regex: new RegExp(word, "i") } },
                { summary: { $regex: new RegExp(word, "i") } },
                { "metadata.concept": { $regex: new RegExp(word, "i") } }
            ]
        }));

        const concepts = await Designs.find({ $and: andClauses });
        res.status(200).json({ msg: "success", count: concepts.length, data: concepts });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const exactSearch = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.status(400).json({ msg: "Query parameter 'q' is required" });
        await logSearchQuery(q);

        const escapedQ = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escapedQ}\\b`, "i");
        
        const concepts = await Designs.find({
            $or: [
                { prompt: { $regex: regex } },
                { response: { $regex: regex } },
                { "metadata.concept": { $regex: regex } }
            ]
        });
        res.status(200).json({ msg: "success", count: concepts.length, data: concepts });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const regexSearch = async (req, res) => {
    try {
        const { pattern } = req.query;
        if (!pattern) return res.status(400).json({ msg: "Query parameter 'pattern' is required" });
        await logSearchQuery(pattern);

        const regex = new RegExp(pattern, "i");
        const concepts = await Designs.find({
            $or: [
                { prompt: { $regex: regex } },
                { response: { $regex: regex } },
                { summary: { $regex: regex } },
                { "metadata.concept": { $regex: regex } }
            ]
        });
        res.status(200).json({ msg: "success", count: concepts.length, data: concepts });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const filterByCategory = async (req, res) => {
    try {
        const { name } = req.query;
        if (!name) return res.status(400).json({ msg: "Query parameter 'name' is required" });
        const concepts = await Designs.find({ "metadata.category": { $regex: new RegExp(`^${name}$`, "i") } });
        res.status(200).json({ msg: "success", count: concepts.length, data: concepts });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const filterByDifficulty = async (req, res) => {
    try {
        const { level } = req.query;
        if (!level) return res.status(400).json({ msg: "Query parameter 'level' is required" });
        const concepts = await Designs.find({ "metadata.difficulty": { $regex: new RegExp(`^${level}$`, "i") } });
        res.status(200).json({ msg: "success", count: concepts.length, data: concepts });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const filterByPattern = async (req, res) => {
    try {
        const { name } = req.query;
        if (!name) return res.status(400).json({ msg: "Query parameter 'name' is required" });
        const concepts = await Designs.find({ "metadata.design_pattern": { $regex: new RegExp(`^${name}$`, "i") } });
        res.status(200).json({ msg: "success", count: concepts.length, data: concepts });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const filterByLanguage = async (req, res) => {
    try {
        const { name } = req.query;
        if (!name) return res.status(400).json({ msg: "Query parameter 'name' is required" });
        const concepts = await Designs.find({ "metadata.language": { $regex: new RegExp(`^${name}$`, "i") } });
        res.status(200).json({ msg: "success", count: concepts.length, data: concepts });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const filterByDate = async (req, res) => {
    try {
        const { after } = req.query;
        if (!after) return res.status(400).json({ msg: "Query parameter 'after' is required (YYYY-MM-DD)" });
        const dateObj = new Date(after);
        const concepts = await Designs.find({ "metadata.generated_at": { $gte: dateObj } });
        res.status(200).json({ msg: "success", count: concepts.length, data: concepts });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const filterByTags = async (req, res) => {
    try {
        const { list } = req.query;
        if (!list) return res.status(400).json({ msg: "Query parameter 'list' is required" });
        const tagsArray = list.split(",").map(t => t.trim());
        const regexArray = tagsArray.map(t => new RegExp(`^${t}$`, "i"));
        const concepts = await Designs.find({ "metadata.tags": { $in: regexArray } });
        res.status(200).json({ msg: "success", count: concepts.length, data: concepts });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const filterByBookmarks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 0;

        let query = Designs.find({ isBookmarked: true });
        if (limit > 0) {
            query = query.skip((page - 1) * limit).limit(limit);
        }
        const concepts = await query;
        const total = await Designs.countDocuments({ isBookmarked: true });

        res.status(200).json({ 
            msg: "success", 
            count: concepts.length, 
            data: concepts,
            total,
            page,
            totalPages: limit > 0 ? Math.ceil(total / limit) : 1
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const filterByTrending = async (req, res) => {
    try {
        const concepts = await Designs.find({ "metadata.isTrending": true });
        res.status(200).json({ msg: "success", count: concepts.length, data: concepts });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const filterByPopular = async (req, res) => {
    try {
        const concepts = await Designs.find().sort({ "metadata.views": -1 }).limit(20);
        res.status(200).json({ msg: "success", count: concepts.length, data: concepts });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const filterByUnexplored = async (req, res) => {
    try {
        const concepts = await Designs.find({ "metadata.views": 0 });
        res.status(200).json({ msg: "success", count: concepts.length, data: concepts });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const filterByExpertOnly = async (req, res) => {
    try {
        const concepts = await Designs.find({
            "metadata.difficulty": { $regex: /expert|advanced/i }
        });
        res.status(200).json({ msg: "success", count: concepts.length, data: concepts });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const filterByFrontend = async (req, res) => {
    try {
        const concepts = await Designs.find({
            $or: [
                { "metadata.category": { $regex: /frontend/i } },
                { "metadata.subcategory": { $regex: /frontend/i } },
                { "metadata.tags": { $regex: /frontend/i } }
            ]
        });
        res.status(200).json({ msg: "success", count: concepts.length, data: concepts });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const filterByBackend = async (req, res) => {
    try {
        const concepts = await Designs.find({
            $or: [
                { "metadata.category": { $regex: /backend/i } },
                { "metadata.subcategory": { $regex: /backend/i } },
                { "metadata.tags": { $regex: /backend/i } }
            ]
        });
        res.status(200).json({ msg: "success", count: concepts.length, data: concepts });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const filterByDevops = async (req, res) => {
    try {
        const concepts = await Designs.find({
            $or: [
                { "metadata.category": { $regex: /devops/i } },
                { "metadata.subcategory": { $regex: /devops/i } },
                { "metadata.tags": { $regex: /devops/i } }
            ]
        });
        res.status(200).json({ msg: "success", count: concepts.length, data: concepts });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const filterByCloud = async (req, res) => {
    try {
        const concepts = await Designs.find({
            $or: [
                { "metadata.category": { $regex: /cloud/i } },
                { "metadata.subcategory": { $regex: /cloud/i } },
                { "metadata.tags": { $regex: /cloud/i } },
                { "metadata.concept": { $regex: /cloud/i } }
            ]
        });
        res.status(200).json({ msg: "success", count: concepts.length, data: concepts });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const getConceptsCursor = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const cursor = req.query.cursor; 

        let query = {};
        if (cursor) {
            query = { _id: { $gt: cursor } };
        }

        const concepts = await Designs.find(query).limit(limit);
        const nextCursor = concepts.length > 0 ? concepts[concepts.length - 1]._id : null;

        res.status(200).json({ 
            msg: "success", 
            data: concepts,
            nextCursor
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const getConceptsInfinite = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const concepts = await Designs.find().skip((page - 1) * limit).limit(limit);
        const total = await Designs.countDocuments();
        
        const hasNextPage = (page * limit) < total;

        res.status(200).json({ 
            msg: "success", 
            data: concepts,
            page,
            hasNextPage
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const paginatedSearchResults = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) return res.status(400).json({ msg: "Query parameter 'q' is required" });

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;

        const regex = new RegExp(q, "i");
        const filter = {
            $or: [
                { prompt: { $regex: regex } },
                { response: { $regex: regex } },
                { summary: { $regex: regex } },
                { "metadata.concept": { $regex: regex } },
                { "metadata.category": { $regex: regex } },
                { "metadata.subcategory": { $regex: regex } },
                { "metadata.tags": { $regex: regex } },
                { "metadata.design_pattern": { $regex: regex } },
                { "metadata.language": { $regex: regex } },
                { "metadata.difficulty": { $regex: regex } }
            ]
        };

        const concepts = await Designs.find(filter).skip((page - 1) * limit).limit(limit);
        const total = await Designs.countDocuments(filter);

        res.status(200).json({ 
            msg: "success", 
            count: concepts.length, 
            data: concepts,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const getBackendRoadmap = async (req, res) => {
    try {
        const concepts = await Designs.find({
            $or: [
                { "metadata.category": { $regex: /backend/i } },
                { "metadata.tags": { $regex: /backend/i } }
            ]
        }).limit(10);
        res.status(200).json({ msg: "Backend learning roadmap", count: concepts.length, data: concepts });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const getFrontendRoadmap = async (req, res) => {
    try {
        const concepts = await Designs.find({
            $or: [
                { "metadata.category": { $regex: /frontend/i } },
                { "metadata.tags": { $regex: /frontend/i } }
            ]
        }).limit(10);
        res.status(200).json({ msg: "Frontend roadmap", count: concepts.length, data: concepts });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const getDevOpsRoadmap = async (req, res) => {
    try {
        const concepts = await Designs.find({
            $or: [
                { "metadata.category": { $regex: /devops/i } },
                { "metadata.tags": { $regex: /devops/i } }
            ]
        }).limit(10);
        res.status(200).json({ msg: "DevOps roadmap", count: concepts.length, data: concepts });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const getSystemDesignRoadmap = async (req, res) => {
    try {
        const concepts = await Designs.find({
            $or: [
                { "metadata.category": { $regex: /system design/i } },
                { "metadata.tags": { $regex: /system design/i } },
                { "metadata.concept": { $regex: /system design/i } }
            ]
        }).limit(10);
        res.status(200).json({ msg: "System design roadmap", count: concepts.length, data: concepts });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const suggestNextConcept = async (req, res) => {
    try {
        const currentConcept = await Designs.findById(req.params.id);
        if (!currentConcept) return res.status(404).json({ msg: "Concept not found" });

        const nextConcept = await Designs.findOne({
            "metadata.category": currentConcept.metadata.category,
            _id: { $ne: currentConcept._id }
        });

        res.status(200).json({ msg: "Suggest next concept", data: nextConcept });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const getPersonalizedRecommendations = async (req, res) => {
    try {
        const concepts = await Designs.aggregate([{ $sample: { size: 5 } }]);
        res.status(200).json({ msg: "Personalized recommendations", count: concepts.length, data: concepts });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const getDiscoveryTrending = async (req, res) => {
    try {
        const concepts = await Designs.find({ "metadata.isTrending": true })
            .sort({ "metadata.views": -1 })
            .limit(10);
        res.status(200).json({ msg: "Trending concepts", count: concepts.length, data: concepts });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const getHiddenGems = async (req, res) => {
    try {
        const concepts = await Designs.find({ "metadata.views": { $lt: 20 } }).limit(10);
        res.status(200).json({ msg: "Lesser known concepts", count: concepts.length, data: concepts });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const getExpertPicks = async (req, res) => {
    try {
        const concepts = await Designs.find({ "metadata.difficulty": { $regex: /expert|advanced/i } }).limit(10);
        res.status(200).json({ msg: "Expert recommended concepts", count: concepts.length, data: concepts });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const getDailyChallenge = async (req, res) => {
    try {
        const concept = await Designs.aggregate([{ $sample: { size: 1 } }]);
        res.status(200).json({ msg: "Daily system design challenge", data: concept[0] });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

const bookmarkConcept = async (req, res) => {
    try {
        const concept = await Designs.findByIdAndUpdate(
            req.params.conceptId,
            { isBookmarked: true },
            { new: true }
        );
        if (!concept) return res.status(404).json({ msg: "Concept not found" });
        res.status(200).json({ msg: "Bookmarked successfully", data: concept });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error.message });
    }
};

const removeBookmark = async (req, res) => {
    try {
        const concept = await Designs.findByIdAndUpdate(
            req.params.conceptId,
            { isBookmarked: false },
            { new: true }
        );
        if (!concept) return res.status(404).json({ msg: "Concept not found" });
        res.status(200).json({ msg: "Bookmark removed successfully", data: concept });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error.message });
    }
};

const getAllBookmarks = async (req, res) => {
    try {
        const bookmarks = await Designs.find({ isBookmarked: true });
        res.status(200).json({ msg: "success", count: bookmarks.length, data: bookmarks });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error.message });
    }
};

const addNote = async (req, res) => {
    try {
        const { conceptId } = req.params;
        const { content } = req.body;
        
        if (!content) return res.status(400).json({ msg: "Note content is required" });

        const concept = await Designs.findById(conceptId);
        if (!concept) return res.status(404).json({ msg: "Concept not found" });

        const newNote = await Note.create({ conceptId, content });
        res.status(201).json({ msg: "Note added successfully", data: newNote });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error.message });
    }
};

const getNotes = async (req, res) => {
    try {
        const { conceptId } = req.params;
        const notes = await Note.find({ conceptId }).sort({ createdAt: -1 });
        res.status(200).json({ msg: "success", count: notes.length, data: notes });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error.message });
    }
};

const updateNote = async (req, res) => {
    try {
        const { noteId } = req.params;
        const { content } = req.body;
        
        if (!content) return res.status(400).json({ msg: "Note content is required" });

        const note = await Note.findByIdAndUpdate(
            noteId,
            { content, updatedAt: Date.now() },
            { new: true }
        );
        
        if (!note) return res.status(404).json({ msg: "Note not found" });
        res.status(200).json({ msg: "Note updated successfully", data: note });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error.message });
    }
};

const deleteNote = async (req, res) => {
    try {
        const { noteId } = req.params;
        const note = await Note.findByIdAndDelete(noteId);
        
        if (!note) return res.status(404).json({ msg: "Note not found" });
        res.status(200).json({ msg: "Note deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error.message });
    }
};

const voteOnConcept = async (req, res) => {
    try {
        const { conceptId } = req.params;
        const { vote } = req.body; // expect 1 for upvote, -1 for downvote

        if (vote !== 1 && vote !== -1) {
            return res.status(400).json({ msg: "Vote must be 1 (upvote) or -1 (downvote)" });
        }

        const concept = await Designs.findByIdAndUpdate(
            conceptId,
            { $inc: { votes: vote } },
            { new: true }
        );

        if (!concept) return res.status(404).json({ msg: "Concept not found" });
        res.status(200).json({ msg: "Voted successfully", data: concept });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error.message });
    }
};

const getTopVotedConcepts = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const concepts = await Designs.find().sort({ votes: -1 }).limit(limit);
        res.status(200).json({ msg: "success", count: concepts.length, data: concepts });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: error.message });
    }
};