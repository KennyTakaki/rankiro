/**
 * Tests for DataProcessor implementation
 */

import { DefaultDataProcessor } from '../src/analytics/data-processor';
import type { VideoMetrics } from '../src/data/types';

describe('DefaultDataProcessor', () => {
    let processor: DefaultDataProcessor;

    beforeEach(() => {
        processor = new DefaultDataProcessor();
    });

    describe('processMetrics', () => {
        it('should process valid raw metrics', async () => {
            const rawMetrics = [
                {
                    videoId: 'video-123',
                    timestamp: '2023-01-01T00:00:00Z',
                    views: 1000,
                    likes: 100,
                    dislikes: 5,
                    comments: 50,
                    shares: 25,
                    watchTime: 15000,
                    averageViewDuration: 150,
                    engagementRate: 0.18
                },
                {
                    videoId: 'video-456',
                    timestamp: new Date('2023-01-02'),
                    views: 2000,
                    likes: 200,
                    comments: 100
                }
            ];

            const result = await processor.processMetrics(rawMetrics);

            expect(result).toHaveLength(2);
            expect(result[0].videoId).toBe('video-123');
            expect(result[0].views).toBe(1000);
            expect(result[1].videoId).toBe('video-456');
            expect(result[1].views).toBe(2000);
        });

        it('should handle invalid raw metrics gracefully', async () => {
            const rawMetrics = [
                null,
                undefined,
                'invalid',
                { videoId: 'valid-123', timestamp: '2023-01-01', views: 100 },
                { invalidData: true }
            ];

            const result = await processor.processMetrics(rawMetrics);

            // Filter out results with empty videoId or invalid timestamp
            const validResults = result.filter(r => r.videoId && !isNaN(r.timestamp.getTime()));
            expect(validResults).toHaveLength(1);
            expect(validResults[0].videoId).toBe('valid-123');
        });

        it('should set default values for missing fields', async () => {
            const rawMetrics = [
                {
                    videoId: 'video-123',
                    timestamp: '2023-01-01T00:00:00Z',
                    views: 1000
                    // Missing other fields
                }
            ];

            const result = await processor.processMetrics(rawMetrics);

            expect(result).toHaveLength(1);
            expect(result[0].likes).toBe(0);
            expect(result[0].comments).toBe(0);
            expect(result[0].engagementRate).toBe(0);
        });
    });

    describe('validateMetrics', () => {
        const validMetrics: VideoMetrics = {
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

        it('should validate correct metrics', async () => {
            const result = await processor.validateMetrics([validMetrics]);

            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        it('should detect missing required fields', async () => {
            const invalidMetrics = { ...validMetrics, videoId: '' };

            const result = await processor.validateMetrics([invalidMetrics]);

            expect(result.isValid).toBe(false);
            expect(result.errors).toContainEqual({
                field: 'videoId',
                message: 'Video ID is required',
                value: ''
            });
        });

        it('should detect negative values', async () => {
            const invalidMetrics = { ...validMetrics, views: -100 };

            const result = await processor.validateMetrics([invalidMetrics]);

            expect(result.isValid).toBe(false);
            expect(result.errors).toContainEqual({
                field: 'views',
                message: 'views cannot be negative',
                value: -100
            });
        });

        it('should detect invalid engagement rate', async () => {
            const invalidMetrics = { ...validMetrics, engagementRate: 1.5 };

            const result = await processor.validateMetrics([invalidMetrics]);

            expect(result.isValid).toBe(false);
            expect(result.errors).toContainEqual({
                field: 'engagementRate',
                message: 'Engagement rate must be between 0 and 1',
                value: 1.5
            });
        });

        it('should generate warnings for unusual values', async () => {
            const unusualMetrics = { ...validMetrics, likes: 2000 }; // More likes than views

            const result = await processor.validateMetrics([unusualMetrics]);

            expect(result.isValid).toBe(true);
            expect(result.warnings).toContainEqual({
                field: 'likes',
                message: 'Likes exceed views, which is unusual',
                value: 2000
            });
        });
    });

    describe('aggregateMetrics', () => {
        const metrics: VideoMetrics[] = [
            {
                videoId: 'video-123',
                timestamp: new Date('2023-01-01T10:00:00Z'),
                views: 1000,
                likes: 100,
                comments: 50,
                shares: 25,
                watchTime: 15000,
                averageViewDuration: 150,
                engagementRate: 0.18,
                dislikes: 5
            },
            {
                videoId: 'video-123',
                timestamp: new Date('2023-01-01T14:00:00Z'),
                views: 500,
                likes: 50,
                comments: 25,
                shares: 10,
                watchTime: 7500,
                averageViewDuration: 150,
                engagementRate: 0.17,
                dislikes: 2
            }
        ];

        it('should aggregate metrics by day', async () => {
            const result = await processor.aggregateMetrics(metrics, 'day');

            expect(result).toHaveLength(1);
            expect(result[0].videoId).toBe('video-123');
            expect(result[0].totalViews).toBe(1500);
            expect(result[0].totalLikes).toBe(150);
            expect(result[0].totalComments).toBe(75);
        });

        it('should aggregate metrics by hour', async () => {
            const result = await processor.aggregateMetrics(metrics, 'hour');

            expect(result).toHaveLength(2); // Two different hours
            expect(result[0].totalViews).toBe(1000);
            expect(result[1].totalViews).toBe(500);
        });

        it('should handle empty metrics array', async () => {
            const result = await processor.aggregateMetrics([], 'day');

            expect(result).toHaveLength(0);
        });
    });

    describe('calculateDerivedMetrics', () => {
        it('should calculate engagement rate when missing', async () => {
            const metrics: VideoMetrics[] = [{
                videoId: 'video-123',
                timestamp: new Date(),
                views: 1000,
                likes: 100,
                comments: 50,
                shares: 25,
                watchTime: 15000,
                averageViewDuration: 0, // Will be calculated
                engagementRate: 0, // Will be calculated
                dislikes: 5
            }];

            const result = await processor.calculateDerivedMetrics(metrics);

            expect(result[0].engagementRate).toBe(0.175); // (100 + 50 + 25) / 1000
            expect(result[0].averageViewDuration).toBe(15); // 15000 / 1000
        });

        it('should cap engagement rate at 1.0', async () => {
            const metrics: VideoMetrics[] = [{
                videoId: 'video-123',
                timestamp: new Date(),
                views: 100,
                likes: 200, // More likes than views
                comments: 50,
                shares: 25,
                watchTime: 1500,
                averageViewDuration: 0,
                engagementRate: 0,
                dislikes: 5
            }];

            const result = await processor.calculateDerivedMetrics(metrics);

            expect(result[0].engagementRate).toBe(1.0); // Capped at 1.0
        });

        it('should preserve existing calculated values', async () => {
            const metrics: VideoMetrics[] = [{
                videoId: 'video-123',
                timestamp: new Date(),
                views: 1000,
                likes: 100,
                comments: 50,
                shares: 25,
                watchTime: 15000,
                averageViewDuration: 200, // Already calculated
                engagementRate: 0.2, // Already calculated
                dislikes: 5
            }];

            const result = await processor.calculateDerivedMetrics(metrics);

            expect(result[0].engagementRate).toBe(0.2);
            expect(result[0].averageViewDuration).toBe(200);
        });
    });
});