import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try{
        const lat = request.nextUrl.searchParams.get("lat");
        const lon = request.nextUrl.searchParams.get("lon");

        const key = process.env.GOOGLE_MAPS_API_KEY

        const response = await fetch(
            `https://weather.googleapis.com/v1/currentConditions:lookup?key=${key}&location.latitude=${lat}&location.longitude=${lon}`
        );

        if (!response.ok) {
            return NextResponse.json(
                {
                    error: "Unable to retrieve local weather. Try again later.",
                },
                {
                    status: response.status,
                }
            );
        }
        

        const data = await response.json();

        return NextResponse.json(data)
    } catch (err) {
        console.error(err);

        return NextResponse.json(
            {
                error: "Internal server error.",
            },
            {
                status: 500,
            }
        );
    }
}