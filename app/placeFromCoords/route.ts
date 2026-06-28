'use server'

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {

    const lat = request.nextUrl.searchParams.get("lat");
    const lon = request.nextUrl.searchParams.get("lon");

    
    if (!lat || !lon) {
        return NextResponse.json(
            { error: "Missing place" },
            { status: 400 }
        );
    }

    const key = process.env.GOOGLE_MAPS_API_KEY //process.env.OPEN_WEATHER_API_KEY
    console.log(lat)
    console.log(lon)
    console.log(key)
    const response = await fetch(
     `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${key}`
    );

    const data = await response.json();
    return NextResponse.json(data);
}