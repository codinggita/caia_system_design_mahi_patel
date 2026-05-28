const express = require('express');
const router = express.Router();

const { 
    getBackendRoadmap,
    getFrontendRoadmap,
    getDevOpsRoadmap,
    getSystemDesignRoadmap,
    suggestNextConcept,
    getPersonalizedRecommendations,
    getDiscoveryTrending,
    getHiddenGems,
    getExpertPicks,
    getDailyChallenge,
    getAll, 
    getConceptById, 
    createConcept, 
    updateConcept, 
    patchConcept, 
    deleteConcept, 
    getRandomConcept, 
    getLatestConcepts,
    getTrendingConcepts,
    getPopularConcepts,
    getConceptSummary,
    getConceptHistory,
    archiveConcept,
    restoreConcept,
    getRelatedConcepts,
    getAllCategories,
    getCategoryDetails,
    getConceptsByCategory,
    getAllSubcategories,
    getAllTags,
    getConceptsByTag,
    getAllPatterns,
    getConceptsByPattern,
    getSupportedLanguages,
    getConceptsByLanguage,
    getDifficultyLevels,
    getConceptsByDifficulty,
    getQuestionTypes,
    getConceptsByQuestionType,
    getMicroservicesConcepts,
    globalSearch,
    searchByTitle,
    searchByContent,
    searchByTags,
    searchByPatterns,
    searchByLanguage,
    searchByCategory,
    searchByDifficulty,
    fuzzySearch,
    autocompleteSearch,
    getRecentSearches,
    getPopularSearches,
    voiceSearch,
    exactSearch,
    regexSearch,
    filterByCategory,
    filterByDifficulty,
    filterByPattern,
    filterByLanguage,
    filterByDate,
    filterByTags,
    filterByBookmarks,
    filterByTrending,
    filterByPopular,
    filterByUnexplored,
    filterByExpertOnly,
    filterByFrontend,
    filterByBackend,
    filterByDevops,
    filterByCloud,
    getConceptsCursor,
    getConceptsInfinite,
    paginatedSearchResults,
    bookmarkConcept,
    removeBookmark,
    getAllBookmarks,
    addNote,
    getNotes,
    updateNote,
    deleteNote,
    voteOnConcept,
    getTopVotedConcepts,
    bulkCreateConcepts,
    bulkUpdateConcepts,
    bulkDeleteConcepts,
    bulkArchiveConcepts,
    bulkRestoreConcepts
} = require('../controllers/controllers');

const {
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
} = require('../controllers/analyticsController');

router.get("/concepts", getAll);
router.get("/concepts/scroll", getConceptsCursor);
router.get("/concepts/infinite", getConceptsInfinite);
router.get("/concepts/bookmarks", filterByBookmarks);
router.get("/concepts/random", getRandomConcept);
router.get("/concepts/latest", getLatestConcepts);
router.get("/concepts/trending", getTrendingConcepts);
router.get("/concepts/popular", getPopularConcepts);
router.get("/concepts/:id", getConceptById);
router.get("/concepts/:id/summary", getConceptSummary);
router.get("/concepts/:id/history", getConceptHistory);
router.get("/concepts/:id/related", getRelatedConcepts);

router.get("/categories", getAllCategories);
router.get("/categories/:category", getCategoryDetails);
router.get("/categories/:category/concepts", getConceptsByCategory);
router.get("/subcategories", getAllSubcategories);

router.get("/tags", getAllTags);
router.get("/tags/:tag", getConceptsByTag);

router.get("/patterns", getAllPatterns);
router.get("/patterns/:patternName", getConceptsByPattern);

router.get("/languages", getSupportedLanguages);
router.get("/languages/:language", getConceptsByLanguage);

router.get("/difficulty", getDifficultyLevels);
router.get("/difficulty/:level", getConceptsByDifficulty);

router.get("/question-types", getQuestionTypes);
router.get("/question-types/:type", getConceptsByQuestionType);

router.get("/architectures/microservices", getMicroservicesConcepts);

router.get("/search", globalSearch);
router.get("/search/results", paginatedSearchResults);
router.get("/search/title", searchByTitle);
router.get("/search/content", searchByContent);
router.get("/search/tags", searchByTags);
router.get("/search/patterns", searchByPatterns);
router.get("/search/language", searchByLanguage);
router.get("/search/category", searchByCategory);
router.get("/search/difficulty", searchByDifficulty);

router.get("/search/fuzzy", fuzzySearch);
router.get("/search/autocomplete", autocompleteSearch);
router.get("/search/recent", getRecentSearches);
router.get("/search/popular", getPopularSearches);
router.get("/search/voice", voiceSearch);
router.get("/search/exact", exactSearch);
router.get("/search/regex", regexSearch);

router.get("/filter/category", filterByCategory);
router.get("/filter/difficulty", filterByDifficulty);
router.get("/filter/pattern", filterByPattern);
router.get("/filter/language", filterByLanguage);
router.get("/filter/date", filterByDate);
router.get("/filter/tags", filterByTags);
router.get("/filter/bookmarks", filterByBookmarks);
router.get("/filter/trending", filterByTrending);
router.get("/filter/popular", filterByPopular);
router.get("/filter/unexplored", filterByUnexplored);
router.get("/filter/expert-only", filterByExpertOnly);
router.get("/filter/frontend", filterByFrontend);
router.get("/filter/backend", filterByBackend);
router.get("/filter/devops", filterByDevops);
router.get("/filter/cloud", filterByCloud);

// Bulk Concept Routes
router.post("/concepts/bulk/create", bulkCreateConcepts);
router.patch("/concepts/bulk/update", bulkUpdateConcepts);
router.delete("/concepts/bulk/delete", bulkDeleteConcepts);
router.patch("/concepts/bulk/archive", bulkArchiveConcepts);
router.patch("/concepts/bulk/restore", bulkRestoreConcepts);

router.patch("/concepts/:id/archive", archiveConcept);
router.patch("/concepts/:id/restore", restoreConcept);
router.post("/concepts", createConcept);
router.put("/concepts/:id", updateConcept);
router.patch("/concepts/:id", patchConcept);
router.delete("/concepts/:id", deleteConcept);

// Analytics Routes
router.get("/analytics/total-concepts", getTotalConcepts);
router.get("/analytics/category-distribution", getCategoryDistribution);
router.get("/analytics/difficulty-stats", getDifficultyStats);
router.get("/analytics/patterns/top", getTopPatterns);
router.get("/analytics/languages/top", getTopLanguages);
router.get("/analytics/views/top", getTopViewed);
router.get("/analytics/bookmarks/top", getTopBookmarked);
router.get("/analytics/trending", getTrendingAnalytics);
router.get("/analytics/growth", getMonthlyGrowth);
router.get("/analytics/searches/top", getTopSearches);
router.get("/analytics/searches/failed", getFailedSearches);
router.get("/analytics/engagement", getEngagement);
router.get("/analytics/api-performance", getApiPerformance);
router.get("/analytics/database-performance", getDatabasePerformance);
router.get("/analytics/cache-hit-rate", getCacheHitRate);

// Discovery Routes
router.get("/discovery/roadmap/backend", getBackendRoadmap);
router.get("/discovery/roadmap/frontend", getFrontendRoadmap);
router.get("/discovery/roadmap/devops", getDevOpsRoadmap);
router.get("/discovery/roadmap/system-design", getSystemDesignRoadmap);
router.get("/discovery/suggest-next/:id", suggestNextConcept);
router.get("/discovery/recommended/:userId", getPersonalizedRecommendations);
router.get("/discovery/trending", getDiscoveryTrending);
router.get("/discovery/hidden-gems", getHiddenGems);
router.get("/discovery/expert-picks", getExpertPicks);
router.get("/discovery/daily-challenge", getDailyChallenge);
// Bookmark Routes
router.post("/bookmarks/:conceptId", bookmarkConcept);
router.delete("/bookmarks/:conceptId", removeBookmark);
router.get("/bookmarks", getAllBookmarks);

// Note Routes
router.post("/notes/:conceptId", addNote);
router.get("/notes/:conceptId", getNotes);
router.patch("/notes/:noteId", updateNote);
router.delete("/notes/:noteId", deleteNote);

// Vote Routes
router.post("/votes/:conceptId", voteOnConcept);
router.get("/votes/top", getTopVotedConcepts);

module.exports = router;