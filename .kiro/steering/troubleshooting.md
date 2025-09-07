---
inclusion: always
---

# Troubleshooting Guide

## Common Issues and Solutions

### Package Management Issues

**Issue: `pnpm install` fails with workspace resolution errors**
```bash
# Solution: Clear cache and reinstall
pnpm store prune
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

**Issue: Workspace dependency not found**
```bash
# Check if package is properly defined in workspace
pnpm list --recursive
# Ensure package.json has correct name and workspace reference
```

### Build Issues

**Issue: TypeScript compilation errors across packages**
```bash
# Build packages in dependency order
pnpm turbo run build --filter @monorepo/package-name...
# Check tsconfig.json extends the correct shared configuration
```

**Issue: Turborepo cache issues**
```bash
# Clear Turborepo cache
pnpm turbo run build --force
# Or delete cache directory
rm -rf .turbo
```

### Development Issues

**Issue: Hot reload not working in development**
- Check if dev script is properly configured in package.json
- Ensure file watching is enabled in development tools
- Verify port conflicts between packages

**Issue: Import/export errors between packages**
- Verify package.json exports are correctly defined
- Check if consuming package has the dependency listed
- Ensure TypeScript paths are configured correctly

### Git and Quality Issues

**Issue: Pre-commit hooks failing**
```bash
# Run checks manually to identify issues
pnpm lint:all
pnpm type-check
pnpm test:all

# Fix formatting issues
pnpm format:all
```

**Issue: Gitleaks detecting false positives**
- Add patterns to .gitleaksignore file
- Use specific regex patterns for legitimate test data

### Testing Issues

**Issue: Jest tests failing with module resolution**
- Check jest.config.js moduleNameMapping
- Ensure ts-jest is properly configured
- Verify test files are in correct locations

**Issue: Test coverage not working**
- Check collectCoverageFrom patterns in jest.config.js
- Ensure source files are included in coverage collection
- Verify coverage thresholds are realistic

### Performance Issues

**Issue: Slow build times**
- Enable Turborepo caching
- Use incremental TypeScript compilation
- Optimize dependency graphs
- Consider parallel execution limits

**Issue: Large bundle sizes**
- Analyze bundle composition
- Implement tree shaking
- Use dynamic imports where appropriate
- Optimize dependencies

### Environment Issues

**Issue: Environment variables not loading**
- Check .env file location and naming
- Verify environment variable names and casing
- Ensure proper loading in application startup

**Issue: AWS CDK deployment failures**
- Check AWS credentials and permissions
- Verify CDK context values
- Review CloudFormation stack events
- Check resource naming conflicts

## Getting Help

1. **Check Documentation**: Review package README files and this steering guide
2. **Search Issues**: Look for similar issues in the project repository
3. **Debug Mode**: Use verbose flags for detailed error information
4. **Clean State**: Try with a clean workspace (pnpm reset)
5. **Version Check**: Ensure all tools are using compatible versions