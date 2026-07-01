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

    const key = process.env.METEO_SOURCE_API_KEY //process.env.OPEN_WEATHER_API_KEY
    try{
        const response = await fetch(
        // `https://api.openweathermap.org/data/4.0/onecall/timeline/1day?lat=${lat}&lon=${lon}&appid=${key}` openweather
        `https://www.meteosource.com/api/v1/free/point?lat=${lat}&lon=${lon}&units=metric&sections=all&key=${key}`
        );

        const data = await response.json();
        return NextResponse.json(data,{status:response.status,});
    }catch(err){
        throw err
    }
}