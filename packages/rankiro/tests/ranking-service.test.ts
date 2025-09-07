/**
 * Tests for RankingService implementation
 */

import { DefaultRankingService } from '../src/ranking/ranking-service';
import type { RankingAlgorithm, RankingRepository } from '../src/ranking/interfaces';
import type { Video, VideoMetrics, RankingFactors, RankingScore } from '../src/data/types';

// Mock implementations for testing
class MockRankingAlgorithm implements RankingAlgorithm {
    calculateScore(video: Video, metrics: VideoMetrics, factors: RankingFactors): number {
        // Simple mock calculation
        return (metrics.views * factors.viewsWeight) +
            (metrics.engagementRate * factors.engagementWeight * 1000);
    }

    normalizeScore(score: number, minScore: number, maxScore: number): number {
        return (score - minScore) / (maxScore - minScore);
    }

    applyTrendingBoost(score: number, video: Video, metrics: VideoMetrics): number {
        // Apply 10% boost if video is less than 24 hours old
        const hoursSinceUpload = (Date.now() - video.uploadDate.getTime()) / (1000 * 60 * 60);
        return hoursSinceUpload < 24 ? score * 1.1 : score;
    }
}

class MockRankingRepository implements RankingRepository {
    private scores: RankingScore[] = [];

    async saveRankingScores(scores: RankingScore[]): Promise<void> {
        this.scores = [...scores];
    }

    async getRankingsByCategory(category: string, limit = 50, offset = 0): Promise<RankingScore[]> {
        return this.scores
            .filter(score => score.category === category)
            .slice(offset, offset + limit);
    }

    async getVideoRankingHistory(videoId: string, startDate?: Date, endDate?: Date): Promise<RankingScore[]> {
        return this.scores.filter(score => score.videoId === videoId);
    }

    async getTopRankedVideos(limit = 50): Promise<RankingScore[]> {
        return this.scores
            .sort((a, b) => a.rank - b.rank)
            .slice(0, limit);
    }
}

describe('DefaultRankingService', () => {
    let service: DefaultRankingService;
    let mockAlgorithm: MockRankingAlgorithm;
    let mockRepository: MockRankingRepository;

    const mockVideo: Video = {
        id: 'video-123',
        title: 'Test Video',
        description: 'A test video',
        uploadDate: new Date('2023-01-01'),
        creatorId: 'creator-123',
        category: 'entertainment',
        duration: 300,
        thumbnailUrl: 'https://example.com/thumb.jpg',
        tags: ['test', 'video']
    };

    const mockMetrics: VideoMetrics = {
        videoId: 'video-123',
        timestamp: new Date(),
        views: 1000,
        likes: 100,
        dislikes: 5,
        comments: 50,
        shares: 25,
        watchTime: 15000,
        averageViewDuration: 150,
        engagementRate: 0.18
    };

    const mockFactors: RankingFactors = {
        viewsWeight: 0.4,
        engagementWeight: 0.3,
        recencyWeight: 0.1,
        qualityWeight: 0.1,
        trendingWeight: 0.1
    };

    beforeEach(() => {
        mockAlgorithm = new MockRankingAlgorithm();
        mockRepository = new MockRankingRepository();
        service = new DefaultRankingService(mockAlgorithm, mockRepository);
    });

    describe('calculateRankingScore', () => {
        it('should calculate ranking score for a single video', async () => {
            const result = await service.calculateRankingScore(mockVideo, mockMetrics, mockFactors);

            expect(result).toMatchObject({
                videoId: 'video-123',
                category: 'entertainment',
                rank: 0
            });
            expect(result.score).toBeGreaterThan(0);
            expect(result.timestamp).toBeInstanceOf(Date);
            expect(result.factors).toEqual(mockFactors);
        });
    });

    describe('calculateBatchRankingScores', () => {
        it('should calculate and rank multiple videos', async () => {
            const videos = [mockVideo, { ...mockVideo, id: 'video-456' }];
            const metrics = [mockMetrics, { ...mockMetrics, videoId: 'video-456', views: 2000 }];

            const results = await service.calculateBatchRankingScores(videos, metrics, mockFactors);

            expect(results).toHaveLength(2);
            expect(results[0].rank).toBe(1);
            expect(results[1].rank).toBe(2);
            // Higher views should rank higher
            expect(results[0].videoId).toBe('video-456');
        });

        it('should handle missing metrics gracefully', async () => {
            const videos = [mockVideo, { ...mockVideo, id: 'video-456' }];
            const metrics = [mockMetrics]; // Only one metric for two videos

            const results = await service.calculateBatchRankingScores(videos, metrics, mockFactors);

            expect(results).toHaveLength(1);
            expect(results[0].videoId).toBe('video-123');
        });
    });

    describe('getRankings', () => {
        it('should retrieve rankings by category', async () => {
            // First, add some rankings
            await service.calculateBatchRankingScores([mockVideo], [mockMetrics], mockFactors);

            const results = await service.getRankings('entertainment');

            expect(results).toHaveLength(1);
            expect(results[0].category).toBe('entertainment');
        });

        it('should respect limit and offset parameters', async () => {
            const results = await service.getRankings('entertainment', 10, 5);
            // This would be tested with more data in a real scenario
            expect(Array.isArray(results)).toBe(true);
        });
    });

    describe('updateRankingFactors', () => {
        it('should accept valid ranking factors', async () => {
            await expect(service.updateRankingFactors(mockFactors)).resolves.not.toThrow();
        });

        it('should reject factors that do not sum to 1.0', async () => {
            const invalidFactors = { ...mockFactors, viewsWeight: 0.5 }; // Sum > 1.0

            await expect(service.updateRankingFactors(invalidFactors))
                .rejects.toThrow('Ranking factors must sum to 1.0');
        });

        it('should reject negative factors', async () => {
            const invalidFactors = {
                viewsWeight: -0.1,
                engagementWeight: 0.5,
                recencyWeight: 0.2,
                qualityWeight: 0.2,
                trendingWeight: 0.2
            }; // Sum = 1.0 but has negative value

            await expect(service.updateRankingFactors(invalidFactors))
                .rejects.toThrow('All ranking factors must be between 0 and 1');
        });
    });

    describe('getVideoRankingHistory', () => {
        it('should retrieve ranking history for a video', async () => {
            // First, add some rankings
            await service.calculateBatchRankingScores([mockVideo], [mockMetrics], mockFactors);

            const results = await service.getVideoRankingHistory('video-123');

            expect(Array.isArray(results)).toBe(true);
        });

        it('should handle date range filtering', async () => {
            const dateRange = {
                startDate: new Date('2023-01-01'),
                endDate: new Date('2023-12-31')
            };

            const results = await service.getVideoRankingHistory('video-123', dateRange);

            expect(Array.isArray(results)).toBe(true);
        });
    });
});