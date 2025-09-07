/**
 * Core data types for the Rankiro platform
 */

export interface Video {
    readonly id: string;
    readonly title: string;
    readonly description: string;
    readonly uploadDate: Date;
    readonly creatorId: string;
    readonly duration: number; // in seconds
    readonly thumbnailUrl?: string;
    readonly tags: string[];
    readonly category: string;
}

export interface VideoMetrics {
    readonly videoId: string;
    readonly timestamp: Date;
    readonly views: number;
    readonly likes: number;
    readonly dislikes: number;
    readonly comments: number;
    readonly shares: number;
    readonly watchTime: number; // total watch time in seconds
    readonly averageViewDuration: number; // average view duration in seconds
    readonly engagementRate: number; // calculated engagement rate (0-1)
}

export interface RankingScore {
    readonly videoId: string;
    readonly score: number;
    readonly rank: number;
    readonly category: string;
    readonly timestamp: Date;
    readonly factors: RankingFactors;
}

export interface RankingFactors {
    readonly viewsWeight: number;
    readonly engagementWeight: number;
    readonly recencyWeight: number;
    readonly qualityWeight: number;
    readonly trendingWeight: number;
}

export interface User {
    readonly id: string;
    readonly username: string;
    readonly email: string;
    readonly role: UserRole;
    readonly createdAt: Date;
    readonly isActive: boolean;
}

export enum UserRole {
    CREATOR = 'creator',
    PLATFORM_MANAGER = 'platform_manager',
    DATA_ANALYST = 'data_analyst',
    ADMIN = 'admin'
}

export interface AnalyticsQuery {
    readonly videoIds?: string[];
    readonly creatorIds?: string[];
    readonly categories?: string[];
    readonly dateRange: DateRange;
    readonly metrics: MetricType[];
    readonly groupBy?: GroupByOption;
    readonly limit?: number;
    readonly offset?: number;
}

export interface DateRange {
    readonly startDate: Date;
    readonly endDate: Date;
}

export enum MetricType {
    VIEWS = 'views',
    LIKES = 'likes',
    COMMENTS = 'comments',
    SHARES = 'shares',
    ENGAGEMENT_RATE = 'engagement_rate',
    WATCH_TIME = 'watch_time',
    RANKING_SCORE = 'ranking_score'
}

export enum GroupByOption {
    DAY = 'day',
    WEEK = 'week',
    MONTH = 'month',
    CATEGORY = 'category',
    CREATOR = 'creator'
}

export interface AnalyticsResult {
    readonly data: AnalyticsDataPoint[];
    readonly totalCount: number;
    readonly aggregations?: Record<string, number>;
}

export interface AnalyticsDataPoint {
    readonly timestamp?: Date;
    readonly category?: string;
    readonly creatorId?: string;
    readonly metrics: Record<MetricType, number>;
}