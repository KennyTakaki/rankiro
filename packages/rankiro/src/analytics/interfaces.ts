/**
 * Analytics and data processing interfaces
 */

import type {
    VideoMetrics,
    AnalyticsQuery,
    AnalyticsResult,
    Video,
    MetricType
} from '../data/types.js';

export interface DataProcessor {
    /**
     * Process raw video metrics data
     */
    processMetrics(rawMetrics: unknown[]): Promise<VideoMetrics[]>;

    /**
     * Validate metrics data integrity
     */
    validateMetrics(metrics: VideoMetrics[]): Promise<ValidationResult>;

    /**
     * Aggregate metrics over time periods
     */
    aggregateMetrics(
        metrics: VideoMetrics[],
        groupBy: 'hour' | 'day' | 'week' | 'month'
    ): Promise<AggregatedMetrics[]>;

    /**
     * Calculate derived metrics from raw data
     */
    calculateDerivedMetrics(metrics: VideoMetrics[]): Promise<VideoMetrics[]>;
}

export interface AnalyticsService {
    /**
     * Execute analytics query and return results
     */
    executeQuery(query: AnalyticsQuery): Promise<AnalyticsResult>;

    /**
     * Get trending videos based on recent performance
     */
    getTrendingVideos(category?: string, timeWindow?: number): Promise<Video[]>;

    /**
     * Calculate engagement metrics for videos
     */
    calculateEngagementMetrics(videoIds: string[], dateRange?: { startDate: Date; endDate: Date }): Promise<EngagementMetrics[]>;

    /**
     * Generate performance report for a creator
     */
    generateCreatorReport(creatorId: string, dateRange: { startDate: Date; endDate: Date }): Promise<CreatorReport>;
}

export interface ValidationResult {
    readonly isValid: boolean;
    readonly errors: ValidationError[];
    readonly warnings: ValidationWarning[];
}

export interface ValidationError {
    readonly field: string;
    readonly message: string;
    readonly value: unknown;
}

export interface ValidationWarning {
    readonly field: string;
    readonly message: string;
    readonly value: unknown;
}

export interface AggregatedMetrics {
    readonly period: Date;
    readonly videoId: string;
    readonly totalViews: number;
    readonly totalLikes: number;
    readonly totalComments: number;
    readonly totalShares: number;
    readonly averageEngagementRate: number;
    readonly totalWatchTime: number;
}

export interface EngagementMetrics {
    readonly videoId: string;
    readonly engagementRate: number;
    readonly likeToViewRatio: number;
    readonly commentToViewRatio: number;
    readonly shareToViewRatio: number;
    readonly averageViewDuration: number;
    readonly retentionRate: number;
}

export interface CreatorReport {
    readonly creatorId: string;
    readonly dateRange: { startDate: Date; endDate: Date };
    readonly totalVideos: number;
    readonly totalViews: number;
    readonly totalEngagement: number;
    readonly averageRanking: number;
    readonly topPerformingVideos: Video[];
    readonly engagementTrends: EngagementTrend[];
    readonly recommendations: string[];
}

export interface EngagementTrend {
    readonly date: Date;
    readonly engagementRate: number;
    readonly views: number;
    readonly ranking: number;
}