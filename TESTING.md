# Video Export Testing Guide

This document explains how to run and maintain the automated tests for the video export functionality in your slideshow application.

## Test Structure

```
src/__tests__/
├── utils/
│   └── testHelpers.ts          # Test utilities and mock data
├── mocks/
│   └── remotion.ts            # Mocks for Remotion dependencies
├── server/
│   ├── utils.test.ts          # Unit tests for utility functions
│   └── exportVideo.test.ts    # Integration tests for export function
└── api/
    └── export.test.ts         # API endpoint tests
```

## Running Tests

### Basic Commands

```bash
# Run all tests in watch mode (for development)
npm run test

# Run all tests once
npm run test:run

# Run tests with coverage report
npm run test:coverage

# Run tests with UI interface
npm run test:ui
```

### Running Specific Tests

```bash
# Run only utility tests
npm run test -- src/__tests__/server/utils.test.ts

# Run only API tests
npm run test -- src/__tests__/api/export.test.ts

# Run tests matching a pattern
npm run test -- --grep "getResolution"
```

## Test Coverage Areas

### 1. Unit Tests (`utils.test.ts`)

Tests individual utility functions in isolation:

- **`calculateTotalFrames`**: Verifies frame calculation accuracy
- **`getResolution`**: Tests resolution and aspect ratio calculations
- **`getCodecInfo`**: Validates codec and MIME type mapping
- **`getBitrate`**: Checks bitrate selection for different formats/qualities

### 2. Integration Tests (`exportVideo.test.ts`)

Tests the complete video export flow:

- **Successful export**: Verifies end-to-end video generation
- **Format handling**: Tests MP4 and WebM export formats
- **Audio tracks**: Validates music inclusion in exports
- **Platform compatibility**: Tests error handling for unsupported platforms
- **File cleanup**: Ensures temporary files are properly removed

### 3. API Tests (`export.test.ts`)

Tests the HTTP API endpoint:

- **Successful requests**: Validates proper response format and headers
- **Error handling**: Tests 400 and 500 error responses
- **Payload validation**: Ensures proper request validation

## Mocking Strategy

### Remotion Mocks

The tests mock Remotion's heavy dependencies to avoid actual video rendering:

```typescript
// Mocks are automatically applied
vi.mock('@remotion/bundler', () => ({
  bundle: mockBundle,
}));

vi.mock('@remotion/renderer', () => ({
  renderMedia: mockRenderMedia,
  selectComposition: mockSelectComposition,
}));
```

### File System Mocks

File system operations are mocked to prevent actual file I/O:

```typescript
vi.mock('node:fs', () => ({
  promises: {
    mkdir: vi.fn(),
    copyFile: vi.fn(),
    readFile: vi.fn(),
    rm: vi.fn(),
  },
}));
```

## Test Data

### Mock Export Payload

The `createMockExportPayload` helper creates realistic test data:

```typescript
const payload = createMockExportPayload({
  project: {
    ...createMockExportPayload().project,
    exportSettings: {
      resolution: '1080p',
      format: 'webm',
      quality: 'high',
      fps: 30,
    },
  },
});
```

## Writing New Tests

### Adding Unit Tests

1. Add test cases to existing `describe` blocks
2. Follow the Arrange-Act-Assert pattern
3. Test both success and failure scenarios

```typescript
it('should handle edge case', () => {
  // Arrange
  const input = createTestInput();
  
  // Act
  const result = functionUnderTest(input);
  
  // Assert
  expect(result).toEqual(expectedOutput);
});
```

### Adding Integration Tests

1. Use the mock helpers from `testHelpers.ts`
2. Mock external dependencies
3. Test the complete flow, not just individual functions

```typescript
it('should handle new feature', async () => {
  // Setup mocks
  mockRenderMedia.mockResolvedValue(undefined);
  
  // Test the function
  const result = await renderProjectVideo(payload);
  
  // Verify expectations
  expect(result).toBeDefined();
});
```

## Debugging Tests

### Running Tests in Debug Mode

```bash
# Run with verbose output
npm run test -- --verbose

# Run specific test file with debugging
npm run test -- src/__tests__/server/exportVideo.test.ts --no-coverage
```

### Common Issues

1. **Import Errors**: Ensure all mocked modules are properly imported
2. **Type Errors**: Use proper TypeScript types for test data
3. **Async Tests**: Always `await` async operations and use `async/await`

## Continuous Integration

The tests are designed to run in CI/CD environments:

- No actual video rendering occurs (all mocked)
- No file system dependencies (all mocked)
- Fast execution time (< 5 seconds typically)

## Best Practices

1. **Keep Tests Fast**: Use mocks for external dependencies
2. **Test Boundaries**: Test what your code does, not what dependencies do
3. **Descriptive Names**: Use clear test names that explain the scenario
4. **Isolation**: Each test should be independent and not rely on others
5. **Coverage**: Aim for 80%+ coverage on critical export functionality

## Troubleshooting

### Test Fails with "Cannot find module"

Check the import paths in test files. The relative paths should be correct from the test file location.

### Mock Not Working

Ensure mocks are defined before importing the modules they mock. Use `vi.mock()` at the top of the file.

### Type Errors in Tests

Use the proper TypeScript types from your project's type definitions. Import types from `../../types` when needed.

## Adding Coverage for New Features

When adding new export features:

1. Add unit tests for any new utility functions
2. Add integration tests for the new feature in the export flow
3. Update API tests if the feature affects the API endpoint
4. Update mock data if new fields are added to the export payload

This testing setup provides comprehensive coverage of your video export functionality while keeping tests fast and reliable.
