/**
 * Ranking service interfaces and contracts
 */

import type { Video, VideoMetrics, RankingScore, RankingFactors } from '../data/types.js';

export interface RankingService {
    /**
     * Calculate ranking score for a single video
     */
    calculateRankingScore(video: Video, metrics: VideoMetrics, factors: RankingFactors): Promise<RankingScore>;

    /**
     * Calculate ranking scores for multiple videos
     */
    calculateBatchRankingScores(
        videos: Video[],
        metrics: VideoMetrics[],
        factors: RankingFactors
    ): Promise<RankingScore[]>;

    /**
     * Get current rankings for a category
     */
    getRankings(category: string, limit?: number, offset?: number): Promise<RankingScore[]>;

    /**
     * Update ranking factors for future calculations
     */
    updateRankingFactors(factors: RankingFactors): Promise<void>;

    /**
     * Get historical ranking data for a video
     */
    getVideoRankingHistory(videoId: string, dateRange?: { startDate: Date; endDate: Date }): Promise<RankingScore[]>;
}

export interface RankingAlgorithm {
    /**
     * Calculate the raw ranking score based on video and metrics
     */
    calculateScore(video: Video, metrics: VideoMetrics, factors: RankingFactors): number;

    /**
     * Normalize scores to a 0-1 range
     */
    normalizeScore(score: number, minScore: number, maxScore: number): number;

    /**
     * Apply trending boost to recent high-performing content
     */
    applyTrendingBoost(score: number, video: Video, metrics: VideoMetrics): number;
}

export interface RankingRepository {
    /**
     * Save ranking scores to storage
     */
    saveRankingScores(scores: RankingScore[]): Promise<void>;

    /**
     * Retrieve ranking scores by category
     */
    getRankingsByCategory(category: string, limit?: number, offset?: number): Promise<RankingScore[]>;

    /**
     * Get ranking history for a specific video
     */
    getVideoRankingHistory(videoId: string, startDate?: Date, endDate?: Date): Promise<RankingScore[]>;

    /**
     * Get top-ranked videos across all categories
     */
    getTopRankedVideos(limit?: number): Promise<RankingScore[]>;
}