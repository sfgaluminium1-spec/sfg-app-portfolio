
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Mock analytics data - in a real app, this would come from your analytics system
    const categories = ['Production', 'Quality', 'Efficiency', 'Sales', 'Customer', 'Innovation'];
    
    const analyticsData = categories.map(category => ({
      category,
      current: Math.floor(Math.random() * 40) + 60,
      target: Math.floor(Math.random() * 20) + 80,
      previous: Math.floor(Math.random() * 30) + 50
    }));

    return NextResponse.json(analyticsData);
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}
