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
