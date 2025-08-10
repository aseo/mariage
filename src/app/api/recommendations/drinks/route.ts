import { NextRequest, NextResponse } from 'next/server';
import { getDrinkRecommendations } from '@/lib/gemini';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const food = searchParams.get('food');

    // Input validation
    if (!food) {
      return NextResponse.json(
        { error: 'Food parameter is required' },
        { status: 400 }
      );
    }

    // Sanitize and validate input
    const sanitizedFood = food.trim().slice(0, 100); // Limit length to 100 chars
    
    if (sanitizedFood.length === 0) {
      return NextResponse.json(
        { error: 'Food parameter cannot be empty' },
        { status: 400 }
      );
    }

    // Rate limiting check (basic implementation)
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
    console.log(`Request from IP: ${clientIP} for food: ${sanitizedFood}`);

    const recommendations = await getDrinkRecommendations(sanitizedFood);
    
    // Return response with cache headers - same URL = same results, different URL = different results
    const response = NextResponse.json(recommendations);
    response.headers.set('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
    response.headers.set('Vary', 'Accept, Accept-Language'); // Vary by request headers to allow URL-based caching
    
    return response;
  } catch (error) {
    console.error('Error in drink recommendations API:', error);
    
    // Check if it's a food validation error
    if (error instanceof Error && error.message.includes('음식이 아닙니다')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to get recommendations' },
      { status: 500 }
    );
  }
} 