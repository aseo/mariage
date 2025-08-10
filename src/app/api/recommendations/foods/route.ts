import { NextRequest, NextResponse } from 'next/server';
import { getFoodRecommendations } from '@/lib/gemini';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const drink = searchParams.get('drink');

    if (!drink) {
      return NextResponse.json({ error: 'Drink parameter is required' }, { status: 400 });
    }

    const sanitizedDrink = drink.trim().slice(0, 100);
    if (sanitizedDrink.length === 0) {
      return NextResponse.json({ error: 'Drink parameter cannot be empty' }, { status: 400 });
    }

    const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
    console.log(`Request from IP: ${clientIP} for drink: ${sanitizedDrink}`);

    const recommendations = await getFoodRecommendations(sanitizedDrink);

    // Return the array directly for Option 1
    const response = NextResponse.json(recommendations);
    response.headers.set('Cache-Control', 'public, max-age=86400');
    response.headers.set('Vary', 'Accept, Accept-Language');
    return response;
  } catch (error) {
    console.error('Error in food recommendations API:', error);
    return NextResponse.json({ error: 'Failed to get recommendations' }, { status: 500 });
  }
}

