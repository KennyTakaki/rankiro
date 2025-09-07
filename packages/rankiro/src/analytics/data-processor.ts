/**
 * Core data processing implementation
 */

import type { VideoMetrics } from '../data/types.js';
import type {
    DataProcessor,
    ValidationResult,
    ValidationError,
    ValidationWarning,
    AggregatedMetrics
} from './interfaces.js';

export class DefaultDataProcessor implements DataProcessor {
    async processMetrics(rawMetrics: unknown[]): Promise<VideoMetrics[]> {
        const processedMetrics: VideoMetrics[] = [];

        for (const raw of rawMetrics) {
            try {
                const metrics = this.parseRawMetrics(raw);
                if (metrics) {
                    processedMetrics.push(metrics);
                }
            } catch (error) {
                console.warn('Failed to process metrics:', error);
                // In a real implementation, we'd log this properly
            }
        }

        return processedMetrics;
    }

    async validateMetrics(metrics: VideoMetrics[]): Promise<ValidationResult> {
        const errors: ValidationError[] = [];
        const warnings: ValidationWarning[] = [];

        for (const metric of metrics) {
            // Validate required fields
            if (!metric.videoId) {
                errors.push({
                    field: 'videoId',
                    message: 'Video ID is required',
                    value: metric.videoId
                });
            }

            if (!metric.timestamp) {
                errors.push({
                    field: 'timestamp',
                    message: 'Timestamp is required',
                    value: metric.timestamp
                });
            }

            // Validate numeric fields are non-negative
            const numericFields = ['views', 'likes', 'dislikes', 'comments', 'shares', 'watchTime', 'averageViewDuration'];
            for (const field of numericFields) {
                const value = metric[field as keyof VideoMetrics] as number;
                if (typeof value === 'number' && value < 0) {
                    errors.push({
                        field,
                        message: `${field} cannot be negative`,
                        value
                    });
                }
            }

            // Validate engagement rate is between 0 and 1
            if (metric.engagementRate < 0 || metric.engagementRate > 1) {
                errors.push({
                    field: 'engagementRate',
                    message: 'Engagement rate must be between 0 and 1',
                    value: metric.engagementRate
                });
            }

            // Warning for unusual values
            if (metric.likes > metric.views) {
                warnings.push({
                    field: 'likes',
                    message: 'Likes exceed views, which is unusual',
                    value: metric.likes
                });
            }

            if (metric.averageViewDuration > metric.watchTime && metric.views > 1) {
                warnings.push({
                    field: 'averageViewDuration',
                    message: 'Average view duration exceeds total watch time',
                    value: metric.averageViewDuration
                });
            }
        }

        return {
            isValid: errors.length === 0,
            errors,
            warnings
        };
    }

    async aggregateMetrics(
        metrics: VideoMetrics[],
        groupBy: 'hour' | 'day' | 'week' | 'month'
    ): Promise<AggregatedMetrics[]> {
        const aggregationMap = new Map<string, AggregatedMetrics>();

        for (const metric of metrics) {
            const periodKey = this.getPeriodKey(metric.timestamp, groupBy);
            const key = `${metric.videoId}-${periodKey}`;

            const existing = aggregationMap.get(key);
            if (existing) {
                // Aggregate the metrics
                aggregationMap.set(key, {
                    ...existing,
                    totalViews: existing.totalViews + metric.views,
                    totalLikes: existing.totalLikes + metric.likes,
                    totalComments: existing.totalComments + metric.comments,
                    totalShares: existing.totalShares + metric.shares,
                    totalWatchTime: existing.totalWatchTime + metric.watchTime,
                    averageEngagementRate: (existing.averageEngagementRate + metric.engagementRate) / 2
                });
            } else {
                aggregationMap.set(key, {
                    period: this.getPeriodDate(metric.timestamp, groupBy),
                    videoId: metric.videoId,
                    totalViews: metric.views,
                    totalLikes: metric.likes,
                    totalComments: metric.comments,
                    totalShares: metric.shares,
                    totalWatchTime: metric.watchTime,
                    averageEngagementRate: metric.engagementRate
                });
            }
        }

        return Array.from(aggregationMap.values());
    }

    async calculateDerivedMetrics(metrics: VideoMetrics[]): Promise<VideoMetrics[]> {
        return metrics.map(metric => {
            // Calculate engagement rate if not provided
            let engagementRate = metric.engagementRate;
            if (engagementRate === 0 && metric.views > 0) {
                const totalEngagement = metric.likes + metric.comments + metric.shares;
                engagementRate = totalEngagement / metric.views;
            }

            // Calculate average view duration if not provided
            let averageViewDuration = metric.averageViewDuration;
            if (averageViewDuration === 0 && metric.views > 0) {
                averageViewDuration = metric.watchTime / metric.views;
            }

            return {
                ...metric,
                engagementRate: Math.min(engagementRate, 1), // Cap at 1.0
                averageViewDuration
            };
        });
    }

    private parseRawMetrics(raw: unknown): VideoMetrics | null {
        if (!raw || typeof raw !== 'object') {
            return null;
        }

        const obj = raw as Record<string, unknown>;

        try {
            return {
                videoId: String(obj.videoId || ''),
                timestamp: new Date(obj.timestamp as string | number | Date),
                views: Number(obj.views || 0),
                likes: Number(obj.likes || 0),
                dislikes: Number(obj.dislikes || 0),
                comments: Number(obj.comments || 0),
                shares: Number(obj.shares || 0),
                watchTime: Number(obj.watchTime || 0),
                averageViewDuration: Number(obj.averageViewDuration || 0),
                engagementRate: Number(obj.engagementRate || 0)
            };
        } catch {
            return null;
        }
    }

    private getPeriodKey(date: Date, groupBy: 'hour' | 'day' | 'week' | 'month'): string {
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        const hour = date.getHours();

        switch (groupBy) {
            case 'hour':
                return `${year}-${month}-${day}-${hour}`;
            case 'day':
                return `${year}-${month}-${day}`;
            case 'week':
                const weekStart = new Date(date);
                weekStart.setDate(date.getDate() - date.getDay());
                return `${weekStart.getFullYear()}-${weekStart.getMonth()}-${weekStart.getDate()}`;
            case 'month':
                return `${year}-${month}`;
            default:
                return `${year}-${month}-${day}`;
        }
    }

    private getPeriodDate(date: Date, groupBy: 'hour' | 'day' | 'week' | 'month'): Date {
        const result = new Date(date);

        switch (groupBy) {
            case 'hour':
                result.setMinutes(0, 0, 0);
                break;
            case 'day':
                result.setHours(0, 0, 0, 0);
                break;
            case 'week':
                result.setDate(date.getDate() - date.getDay());
                result.setHours(0, 0, 0, 0);
                break;
            case 'month':
                result.setDate(1);
                result.setHours(0, 0, 0, 0);
                break;
        }

        return result;
    }
}