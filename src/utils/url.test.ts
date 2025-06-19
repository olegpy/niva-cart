import { headers } from 'next/headers';
import { getBaseUrl } from './url';

// Mock the next/headers module
jest.mock('next/headers', () => ({
  headers: jest.fn(),
}));

// Mock process.env
// Save original process.env
const originalEnv = process.env;
beforeAll(() => {
  process.env = { ...originalEnv };
});
// Restore process.env after all tests
afterAll(() => {
  process.env = originalEnv;
});

describe('getBaseUrl', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Reset VERCEL_URL
    delete process.env.VERCEL_URL;
  });

  it('should return Vercel URL when VERCEL_URL is set', async () => {
    process.env.VERCEL_URL = 'my-project.vercel.app';
    const result = await getBaseUrl();
    expect(result).toBe('https://my-project.vercel.app');
  });

  it('should return localhost URL in development environment', async () => {
    // Mock the headers function to return a mock headers object
    (headers as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue('localhost:3000'),
    });
    
    const result = await getBaseUrl();
    expect(result).toBe('http://localhost:3000');
  });

  it('should handle missing host header in development', async () => {
    // Mock the headers function to return a mock headers object with null host
    (headers as jest.Mock).mockReturnValue({
      get: jest.fn().mockReturnValue(null),
    });

    const result = await getBaseUrl();
    expect(result).toBe('http://localhost:3000');
  });
}); 