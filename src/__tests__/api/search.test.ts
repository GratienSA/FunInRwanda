import prismadb from '@/lib/prismadb';
import { GET } from 'auth';
import { NextRequest, NextResponse } from 'next/server';


// Mock de prismadb
jest.mock('@/src/lib/prismadb', () => ({
  listing: {
    findMany: jest.fn(),
    count: jest.fn(),
  },
}));

// Helper function to create a mocked NextRequest
function createMockNextRequest(url: string): NextRequest {
  return {
    nextUrl: new URL(url, 'http://localhost'),
    method: 'GET',
    headers: new Headers(),
  } as NextRequest;
}


describe('GET /api/search', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return search results successfully', async () => {
    const mockResults = [{ id: 1, title: 'Test Listing' }];
    (prismadb.listing.findMany as jest.Mock).mockResolvedValue(mockResults);
    (prismadb.listing.count as jest.Mock).mockResolvedValue(1);

    const req = createMockNextRequest('/api/search');
    const res = await GET(req);
    
    expect(res).toBeInstanceOf(NextResponse);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.results).toEqual(mockResults);
    expect(data.total).toBe(1);
  });

  it('should apply search query correctly', async () => {
    const req = createMockNextRequest('/api/search?q=test');
    await GET(req);

    expect(prismadb.listing.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: expect.arrayContaining([
            { title: { contains: 'test', mode: 'insensitive' } },
            { description: { contains: 'test', mode: 'insensitive' } },
            { locationName: { contains: 'test', mode: 'insensitive' } },
          ]),
        }),
      })
    );
  });

  it('should apply category filter correctly', async () => {
    const req = createMockNextRequest('/api/search?category=apartment');
    await GET(req);

    expect(prismadb.listing.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          category: 'apartment',
        }),
      })
    );
  });

  it('should handle database errors', async () => {
    (prismadb.listing.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

    const req = createMockNextRequest('/api/search');
    const res = await GET(req);
    
    expect(res).toBeInstanceOf(NextResponse);
    expect(res.status).toBe(500);

    const data = await res.json();
    expect(data.error).toBe('Erreur lors de la recherche');
  });

  it('should handle invalid page number', async () => {
    const req = createMockNextRequest('/api/search?page=-1');
    const res = await GET(req);
    
    expect(res).toBeInstanceOf(NextResponse);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(data.page).toBe(1);
  });

  it('should limit results to 50 even if higher limit is requested', async () => {
    const req = createMockNextRequest('/api/search?limit=100');
    await GET(req);

    expect(prismadb.listing.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ take: 50 })
    );
  });

  it('should handle minimum price greater than maximum price', async () => {
    const req = createMockNextRequest('/api/search?minPrice=1000&maxPrice=500');
    await GET(req);

    expect(prismadb.listing.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          price: { gte: 1000, lte: 1000 },
        }),
      })
    );
  });
});
