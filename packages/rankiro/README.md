# @frommiddle/rankiro

Core business logic package for the Rankiro video ranking platform. This package provides the fundamental data models, ranking algorithms, analytics processing, and utility functions needed to build video ranking and analytics applications.

## Features

- **Data Models**: Comprehensive TypeScript interfaces for videos, metrics, rankings, and analytics
- **Ranking Service**: Pluggable ranking algorithms with configurable factors
- **Data Processing**: Robust data validation, aggregation, and derived metrics calculation
- **Analytics**: Query engine for video performance analytics and reporting
- **Utilities**: Common utility functions for validation, date handling, and data manipulation

## Installation

```bash
pnpm add @frommiddle/rankiro
```

## Usage

### Basic Data Types

```typescript
import { Video, VideoMetrics, RankingScore } from '@frommiddle/rankiro';

const video: Video = {
  id: 'video-123',
  title: 'My Awesome Video',
  description: 'A great video about ranking',
  uploadDate: new Date(),
  creatorId: 'creator-456',
  duration: 300,
  tags: ['tutorial', 'ranking'],
  category: 'education'
};

const metrics: VideoMetrics = {
  videoId: 'video-123',
  timestamp: new Date(),
  views: 1000,
  likes: 50,
  dislikes: 2,
  comments: 10,
  shares: 5,
  watchTime: 15000,
  averageViewDuration: 150,
  engagementRate: 0.067
};
```

### Ranking Service

```typescript
import { DefaultRankingService, RankingFactors } from '@frommiddle/rankiro/ranking';

// Configure ranking factors
const factors: RankingFactors = {
  viewsWeight: 0.3,
  engagementWeight: 0.25,
  recencyWeight: 0.2,
  qualityWeight: 0.15,
  trendingWeight: 0.1
};

// Calculate ranking score
const rankingService = new DefaultRankingService(algorithm, repository);
const score = await rankingService.calculateRankingScore(video, metrics, factors);

console.log(`Video ranked #${score.rank} with score ${score.score}`);
```

### Data Processing

```typescript
import { DefaultDataProcessor } from '@frommiddle/rankiro/analytics';

const processor = new DefaultDataProcessor();

// Process raw metrics data
const rawData = [/* raw metrics from API */];
const processedMetrics = await processor.processMetrics(rawData);

// Validate metrics
const validation = await processor.validateMetrics(processedMetrics);
if (!validation.isValid) {
  console.error('Validation errors:', validation.errors);
}

// Aggregate metrics by day
const aggregated = await processor.aggregateMetrics(processedMetrics, 'day');
```

### Analytics Queries

```typescript
import { AnalyticsQuery, MetricType, GroupByOption } from '@frommiddle/rankiro';

const query: AnalyticsQuery = {
  videoIds: ['video-123', 'video-456'],
  dateRange: {
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-01-31')
  },
  metrics: [MetricType.VIEWS, MetricType.ENGAGEMENT_RATE],
  groupBy: GroupByOption.DAY,
  limit: 100
};

const results = await analyticsService.executeQuery(query);
```

### Utility Functions

```typescript
import { isValidEmail, getDateRange, sanitizeString } from '@frommiddle/rankiro/utils';

// Validation
if (isValidEmail(userEmail)) {
  // Process email
}

// Date utilities
const lastWeek = getDateRange(7);

// String sanitization
const cleanInput = sanitizeString(userInput);
```

## Architecture

### Data Models

The package defines comprehensive TypeScript interfaces for all core entities:

- **Video**: Video metadata and properties
- **VideoMetrics**: Performance metrics and engagement data
- **RankingScore**: Calculated ranking scores with factors
- **User**: User accounts and roles
- **Analytics**: Query structures and result formats

### Ranking System

The ranking system is designed to be pluggable and configurable:

- **RankingService**: Main service interface for calculating rankings
- **RankingAlgorithm**: Pluggable algorithm interface for score calculation
- **RankingRepository**: Data persistence interface for rankings
- **RankingFactors**: Configurable weights for different ranking criteria

### Data Processing

Robust data processing pipeline with validation and aggregation:

- **DataProcessor**: Main interface for processing raw metrics data
- **Validation**: Comprehensive validation with errors and warnings
- **Aggregation**: Time-based aggregation (hour, day, week, month)
- **Derived Metrics**: Automatic calculation of derived metrics

### Analytics

Flexible analytics system for querying and reporting:

- **AnalyticsService**: Query execution and result formatting
- **Query Builder**: Type-safe query construction
- **Aggregations**: Statistical aggregations and grouping
- **Reports**: Pre-built report generators

## Testing

Run the test suite:

```bash
pnpm test
```

Run tests in watch mode:

```bash
pnpm test:watch
```

Generate coverage report:

```bash
pnpm test:coverage
```

## Development

### Building

```bash
pnpm build
```

### Linting

```bash
pnpm lint
pnpm lint:fix
```

### Type Checking

```bash
pnpm type-check
```

## API Reference

### Core Interfaces

- `Video` - Video entity with metadata
- `VideoMetrics` - Performance metrics for videos
- `RankingScore` - Calculated ranking with score and factors
- `User` - User account information
- `AnalyticsQuery` - Query structure for analytics
- `AnalyticsResult` - Query result format

### Services

- `RankingService` - Calculate and manage video rankings
- `DataProcessor` - Process and validate metrics data
- `AnalyticsService` - Execute analytics queries and generate reports

### Utilities

- `date-utils` - Date manipulation and formatting functions
- `validation` - Data validation and sanitization functions

## Contributing

1. Follow the established TypeScript and ESLint configurations
2. Write comprehensive tests for new functionality
3. Update documentation for API changes
4. Ensure all tests pass before submitting changes

## License

MIT