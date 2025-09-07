/**
 * Core ranking service implementation
 */

import type { Video, VideoMetrics, RankingScore, RankingFactors } from '../data/types.js';
import type { RankingService, RankingAlgorithm, RankingRepository } from './interfaces.js';

export class DefaultRankingService implements RankingService {
    constructor(
        private readonly algorithm: RankingAlgorithm,
        private readonly repository: RankingRepository
    ) { }

    async calculateRankingScore(
        video: Video,
        metrics: VideoMetrics,
        factors: RankingFactors
    ): Promise<RankingScore> {
        const score = this.algorithm.calculateScore(video, metrics, factors);
        const boostedScore = this.algorithm.applyTrendingBoost(score, video, metrics);

        // For now, we'll set rank to 0 - this would be calculated based on other videos in the category
        const rankingScore: RankingScore = {
            videoId: video.id,
            score: boostedScore,
            rank: 0,
            category: video.category,
            timestamp: new Date(),
            factors
        };

        return rankingScore;
    }

    async calculateBatchRankingScores(
        videos: Video[],
        metrics: VideoMetrics[],
        factors: RankingFactors
    ): Promise<RankingScore[]> {
        const metricsMap = new Map(metrics.map(m => [m.videoId, m]));
        const scores: RankingScore[] = [];

        for (const video of videos) {
            const videoMetrics = metricsMap.get(video.id);
            if (videoMetrics) {
                const score = await this.calculateRankingScore(video, videoMetrics, factors);
                scores.push(score);
            }
        }

        // Sort by score and assign ranks
        scores.sort((a, b) => b.score - a.score);
        const rankedScores = scores.map((score, index) => ({
            ...score,
            rank: index + 1
        }));

        // Save to repository
        await this.repository.saveRankingScores(rankedScores);

        return rankedScores;
    }

    async getRankings(category: string, limit = 50, offset = 0): Promise<RankingScore[]> {
        return this.repository.getRankingsByCategory(category, limit, offset);
    }

    async updateRankingFactors(factors: RankingFactors): Promise<void> {
        // In a real implementation, this would update the factors in a configuration store
        // For now, we'll just validate the factors
        this.validateRankingFactors(factors);
    }

    async getVideoRankingHistory(
        videoId: string,
        dateRange?: { startDate: Date; endDate: Date }
    ): Promise<RankingScore[]> {
        return this.repository.getVideoRankingHistory(
            videoId,
            dateRange?.startDate,
            dateRange?.endDate
        );
    }

    private validateRankingFactors(factors: RankingFactors): void {
        const totalWeight = factors.viewsWeight +
            factors.engagementWeight +
            factors.recencyWeight +
            factors.qualityWeight +
            factors.trendingWeight;

        if (Math.abs(totalWeight - 1.0) > 0.001) {
            throw new Error('Ranking factors must sum to 1.0');
        }

        const weights = [
            factors.viewsWeight,
            factors.engagementWeight,
            factors.recencyWeight,
            factors.qualityWeight,
            factors.trendingWeight
        ];

        if (weights.some(weight => weight < 0 || weight > 1)) {
            throw new Error('All ranking factors must be between 0 and 1');
        }
    }
}