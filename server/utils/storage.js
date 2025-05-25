class MemStorage {
    constructor() {
      this.users = new Map();
      this.resumeAnalyses = new Map();
      this.currentUserId = 1;
      this.currentAnalysisId = 1;
    }
  
    async getUser(id) {
      return this.users.get(id);
    }
  
    async getUserByUsername(username) {
      return Array.from(this.users.values()).find(
        (user) => user.username === username
      );
    }
  
    async createUser(insertUser) {
      const id = this.currentUserId++;
      const user = { ...insertUser, id };
      this.users.set(id, user);
      return user;
    }
  
    async createResumeAnalysis(insertAnalysis) {
      const id = this.currentAnalysisId++;
      const analysis = {
        ...insertAnalysis,
        id,
        createdAt: new Date()
      };
      this.resumeAnalyses.set(id, analysis);
      return analysis;
    }
  
    async getResumeAnalysis(id) {
      return this.resumeAnalyses.get(id);
    }
  
    async getAllResumeAnalyses() {
      return Array.from(this.resumeAnalyses.values()).sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      );
    }
  
    async getUserResumeAnalyses(userId) {
      return Array.from(this.resumeAnalyses.values())
        .filter((analysis) => analysis.userId === userId)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
  
    async deleteResumeAnalysis(id) {
      return this.resumeAnalyses.delete(id);
    }
  
    async updateResumeAnalysis(id, updatedFields) {
      const existing = this.resumeAnalyses.get(id);
      if (!existing) return null;
      const updated = { ...existing, ...updatedFields };
      this.resumeAnalyses.set(id, updated);
      return updated;
    }
  }
  
  const storage = new MemStorage();
  module.exports = { storage };
  