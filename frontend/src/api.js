// Connect to local backend during development, production URL during build
const API_BASE_URL = import.meta.env.DEV ? 'http://localhost:3000/api/v1' : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1');

export const CAIA_API = {
    async fetchWithTimeout(url, options = {}, timeout = 8000) {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        
        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            clearTimeout(id);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            clearTimeout(id);
            console.error('API Request failed:', error);
            throw error;
        }
    },

    // Dashboard Analytics
    async getTotalConcepts() {
        return this.fetchWithTimeout(`${API_BASE_URL}/analytics/total-concepts`);
    },

    // Get All Concepts (for Explore)
    async getAllConcepts() {
        return this.fetchWithTimeout(`${API_BASE_URL}/concepts`);
    },

    // Get Latest Concepts
    async getLatestConcepts() {
        return this.fetchWithTimeout(`${API_BASE_URL}/concepts/latest`);
    },

    // Get Trending Concepts
    async getTrendingConcepts() {
        return this.fetchWithTimeout(`${API_BASE_URL}/concepts/trending`);
    },

    // Get Popular Concepts
    async getPopularConcepts() {
        return this.fetchWithTimeout(`${API_BASE_URL}/concepts/popular`);
    },

    // Get Concept By ID
    async getConceptById(id) {
        return this.fetchWithTimeout(`${API_BASE_URL}/concepts/${id}`);
    },

    // Search concepts
    async searchConcepts(query) {
        return this.fetchWithTimeout(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}`);
    },

    // Get Bookmarks
    async getBookmarks() {
        return this.fetchWithTimeout(`${API_BASE_URL}/bookmarks`);
    },

    // Create a new concept
    async createConcept(conceptData) {
        return this.fetchWithTimeout(`${API_BASE_URL}/concepts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(conceptData)
        });
    },

    // Add bookmark
    async bookmarkConcept(id) {
        return this.fetchWithTimeout(`${API_BASE_URL}/bookmarks/${id}`, {
            method: 'POST'
        });
    },

    // Remove bookmark
    async removeBookmark(id) {
        return this.fetchWithTimeout(`${API_BASE_URL}/bookmarks/${id}`, {
            method: 'DELETE'
        });
    },

    // Analytics Endpoints
    async getCategoryDistribution() {
        return this.fetchWithTimeout(`${API_BASE_URL}/analytics/category-distribution`);
    },
    async getTrendingAnalytics() {
        return this.fetchWithTimeout(`${API_BASE_URL}/analytics/trending`);
    },
    async getDifficultyStats() {
        return this.fetchWithTimeout(`${API_BASE_URL}/analytics/difficulty-stats`);
    },
    async getApiPerformance() {
        return this.fetchWithTimeout(`${API_BASE_URL}/analytics/api-performance`);
    },
    async getCacheHitRate() {
        return this.fetchWithTimeout(`${API_BASE_URL}/analytics/cache-hit-rate`);
    },

    // Discovery / Roadmaps
    async getRoadmap(track) {
        return this.fetchWithTimeout(`${API_BASE_URL}/discovery/roadmap/${track}`);
    },

    // Voting
    async voteOnConcept(id, type) {
        return this.fetchWithTimeout(`${API_BASE_URL}/votes/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type }) // type can be 'up' or 'down'
        });
    },

    // Notes
    async getNotes(conceptId) {
        return this.fetchWithTimeout(`${API_BASE_URL}/notes/${conceptId}`);
    },

    async addNote(conceptId, content) {
        return this.fetchWithTimeout(`${API_BASE_URL}/notes/${conceptId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content })
        });
    }
};
