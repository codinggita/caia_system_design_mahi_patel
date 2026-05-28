const mongoose = require("mongoose");

const conceptSchema = new mongoose.Schema({
  prompt: {
    type: String,
    required: true,
  },

  response: {
    type: String,
    required: true,
  },

  metadata: {
    category: {
      type: String,
      required: true,
    },

    subcategory: {
      type: String,
      required: true,
    },

    concept: {
      type: String,
      required: true,
    },

    question_type: {
      type: String,
      required: true,
    },

    generated_at: {
      type: Date,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    isTrending: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: [String],
      default: [],
    },
    language: {
      type: String,
      default: "",
    },
    difficulty: {
      type: String,
      default: "",
    },
    design_pattern: {
      type: String,
      default: "",
    },
  },
  summary: {
    type: String,
  },
  history: [
    {
      updatedAt: { type: Date, default: Date.now },
      changeLog: String,
    }
  ],
  isArchived: {
    type: Boolean,
    default: false,
  },
  isBookmarked: {
    type: Boolean,
    default: false,
  },
  votes: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("Concept", conceptSchema , "designs");
