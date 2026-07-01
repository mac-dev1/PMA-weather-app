'use server'

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {

    const lat = request.nextUrl.searchParams.get("lat");
    const lon = request.nextUrl.searchParams.get("lon");
    const start = request.nextUrl.searchParams.get("start");
    const count = request.nextUrl.searchParams.get("cnt")
    
    if (!lat || !lon) {
        return NextResponse.json(
            { error: "Missing place" },
            { status: 400 }
        );
    }

    if (!start) {
        return NextResponse.json(
            { error: "Missing date" },
            { status: 400 }
        );
    }

    const key = process.env.OPEN_WEATHER_API_KEY
    
    const response = await fetch(
       `https://api.openweathermap.org/data/4.0/onecall/timeline/1day?cnt=${count}&lat=${lat}&lon=${lon}&start=${start}&appid=${key}`
    );
    
    const data = await response.json();
    
    return NextResponse.json(data);
}