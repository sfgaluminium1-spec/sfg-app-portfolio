
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// Manchester M12 5PG base coordinates (approximate)
const MANCHESTER_BASE = {
  lat: 53.4808,
  lng: -2.2426,
  postcode: "M12 5PG"
};

// Simple distance calculation using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in miles
  return Math.round(distance * 100) / 100; // Round to 2 decimal places
}

// Simple postcode to coordinates mapping for common areas
const POSTCODE_COORDINATES: { [key: string]: { lat: number, lng: number } } = {
  // Manchester areas
  'M1': { lat: 53.4808, lng: -2.2426 },
  'M2': { lat: 53.4808, lng: -2.2426 },
  'M3': { lat: 53.4808, lng: -2.2426 },
  'M4': { lat: 53.4808, lng: -2.2426 },
  'M5': { lat: 53.4808, lng: -2.2426 },
  'M6': { lat: 53.4808, lng: -2.2426 },
  'M7': { lat: 53.4808, lng: -2.2426 },
  'M8': { lat: 53.4808, lng: -2.2426 },
  'M9': { lat: 53.4808, lng: -2.2426 },
  'M10': { lat: 53.4808, lng: -2.2426 },
  'M11': { lat: 53.4808, lng: -2.2426 },
  'M12': { lat: 53.4808, lng: -2.2426 },
  'M13': { lat: 53.4808, lng: -2.2426 },
  'M14': { lat: 53.4808, lng: -2.2426 },
  'M15': { lat: 53.4808, lng: -2.2426 },
  'M16': { lat: 53.4808, lng: -2.2426 },
  'M17': { lat: 53.4808, lng: -2.2426 },
  'M18': { lat: 53.4808, lng: -2.2426 },
  'M19': { lat: 53.4808, lng: -2.2426 },
  'M20': { lat: 53.4808, lng: -2.2426 },
  'M21': { lat: 53.4808, lng: -2.2426 },
  'M22': { lat: 53.4808, lng: -2.2426 },
  'M23': { lat: 53.4808, lng: -2.2426 },
  'M24': { lat: 53.4808, lng: -2.2426 },
  'M25': { lat: 53.4808, lng: -2.2426 },
  'M26': { lat: 53.4808, lng: -2.2426 },
  'M27': { lat: 53.4808, lng: -2.2426 },
  'M28': { lat: 53.4808, lng: -2.2426 },
  'M29': { lat: 53.4808, lng: -2.2426 },
  'M30': { lat: 53.4808, lng: -2.2426 },
  'M31': { lat: 53.4808, lng: -2.2426 },
  'M32': { lat: 53.4808, lng: -2.2426 },
  'M33': { lat: 53.4808, lng: -2.2426 },
  'M34': { lat: 53.4808, lng: -2.2426 },
  'M35': { lat: 53.4808, lng: -2.2426 },
  'M40': { lat: 53.4808, lng: -2.2426 },
  'M41': { lat: 53.4808, lng: -2.2426 },
  'M43': { lat: 53.4808, lng: -2.2426 },
  'M44': { lat: 53.4808, lng: -2.2426 },
  'M45': { lat: 53.4808, lng: -2.2426 },
  'M46': { lat: 53.4808, lng: -2.2426 },
  'M50': { lat: 53.4808, lng: -2.2426 },
  'M60': { lat: 53.4808, lng: -2.2426 },
  'M90': { lat: 53.4808, lng: -2.2426 },
  
  // Other major cities (approximate distances)
  'B': { lat: 52.4862, lng: -1.8904 }, // Birmingham ~90 miles
  'L': { lat: 53.4084, lng: -2.9916 }, // Liverpool ~35 miles
  'LS': { lat: 53.8008, lng: -1.5491 }, // Leeds ~45 miles
  'S': { lat: 53.3811, lng: -1.4701 }, // Sheffield ~40 miles
  'NG': { lat: 52.9548, lng: -1.1581 }, // Nottingham ~70 miles
  'DE': { lat: 52.9225, lng: -1.4746 }, // Derby ~60 miles
  'ST': { lat: 52.9988, lng: -2.1267 }, // Stoke-on-Trent ~35 miles
  'CW': { lat: 53.0943, lng: -2.4274 }, // Crewe ~25 miles
  'WA': { lat: 53.3900, lng: -2.5970 }, // Warrington ~20 miles
  'SK': { lat: 53.4100, lng: -2.1700 }, // Stockport ~10 miles
  'OL': { lat: 53.5447, lng: -2.1127 }, // Oldham ~8 miles
  'BL': { lat: 53.5768, lng: -2.4282 }, // Bolton ~12 miles
  'WN': { lat: 53.5450, lng: -2.6318 }, // Wigan ~20 miles
  'PR': { lat: 53.7632, lng: -2.7031 }, // Preston ~30 miles
  'BB': { lat: 53.7500, lng: -2.4833 }, // Blackburn ~25 miles
  'FY': { lat: 53.8175, lng: -3.0357 }, // Blackpool ~45 miles
  'LA': { lat: 54.0500, lng: -2.8000 }, // Lancaster ~60 miles
};

function getCoordinatesFromPostcode(postcode: string): { lat: number, lng: number } | null {
  const cleanPostcode = postcode.replace(/\s+/g, '').toUpperCase();
  
  // Try exact match first
  if (POSTCODE_COORDINATES[cleanPostcode]) {
    return POSTCODE_COORDINATES[cleanPostcode];
  }
  
  // Try partial matches (first 1-3 characters)
  for (let i = 3; i >= 1; i--) {
    const partial = cleanPostcode.substring(0, i);
    if (POSTCODE_COORDINATES[partial]) {
      return POSTCODE_COORDINATES[partial];
    }
  }
  
  return null;
}

function isManchesterArea(postcode: string): boolean {
  const cleanPostcode = postcode.replace(/\s+/g, '').toUpperCase();
  return cleanPostcode.startsWith('M') && /^M\d/.test(cleanPostcode);
}

export async function POST(request: NextRequest) {
  try {
    const { address, postcode, quoteValue, entityId, calculatedFor } = await request.json();

    if (!address && !postcode) {
      return NextResponse.json(
        { error: 'Address or postcode is required' },
        { status: 400 }
      );
    }

    const targetPostcode = postcode || address.split(' ').pop() || '';
    const coords = getCoordinatesFromPostcode(targetPostcode);
    
    let distanceInMiles: number;
    let estimatedTravelTime: number;
    
    if (coords) {
      distanceInMiles = calculateDistance(
        MANCHESTER_BASE.lat,
        MANCHESTER_BASE.lng,
        coords.lat,
        coords.lng
      );
      estimatedTravelTime = Math.ceil(distanceInMiles * 2); // Rough estimate: 2 minutes per mile
    } else {
      // Default distances for unknown postcodes
      distanceInMiles = 50; // Default 50 miles
      estimatedTravelTime = 100; // Default 100 minutes
    }

    const distanceInKm = Math.round(distanceInMiles * 1.60934 * 100) / 100;

    // Cost calculation
    const costPerMile = 1.0; // £1 per mile
    const minimumCharge = 50.0; // £50 minimum
    const baseCost = distanceInMiles * costPerMile;
    
    // Manchester area exception
    const isManchesterFree = isManchesterArea(targetPostcode) && 
                            quoteValue && 
                            parseFloat(quoteValue) < 2000;
    
    const finalCost = isManchesterFree ? 0 : Math.max(baseCost, minimumCharge);

    // Save calculation to database
    const calculation = await prisma.distanceCalculation.create({
      data: {
        toAddress: address || `Postcode: ${postcode}`,
        toPostcode: targetPostcode,
        distanceInMiles,
        distanceInKm,
        estimatedTravelTime,
        baseCost,
        finalCost,
        isManchesterArea: isManchesterArea(targetPostcode),
        qualifiesForFree: isManchesterFree,
        calculatedFor: calculatedFor || 'SURVEY',
        entityId: entityId || null,
        routeData: {
          method: 'postcode_lookup',
          coordinates: coords,
          baseLocation: MANCHESTER_BASE
        }
      }
    });

    return NextResponse.json({
      success: true,
      calculation: {
        id: calculation.id,
        distanceInMiles,
        distanceInKm,
        estimatedTravelTime,
        baseCost,
        minimumCharge,
        finalCost,
        isManchesterArea: isManchesterArea(targetPostcode),
        qualifiesForFree: isManchesterFree,
        breakdown: {
          formula: `${distanceInMiles} miles × £${costPerMile}/mile = £${baseCost.toFixed(2)}`,
          minimumApplied: baseCost < minimumCharge,
          manchesterException: isManchesterFree,
          finalCalculation: isManchesterFree 
            ? "Free for Manchester projects under £2000"
            : `Max(£${baseCost.toFixed(2)}, £${minimumCharge}) = £${finalCost.toFixed(2)}`
        }
      }
    });

  } catch (error) {
    console.error('Distance calculation error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate distance' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const entityId = searchParams.get('entityId');
    const calculatedFor = searchParams.get('calculatedFor');

    const where: any = {};
    if (entityId) where.entityId = entityId;
    if (calculatedFor) where.calculatedFor = calculatedFor;

    const calculations = await prisma.distanceCalculation.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    return NextResponse.json({ calculations });

  } catch (error) {
    console.error('Get distance calculations error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch calculations' },
      { status: 500 }
    );
  }
}
