import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {

    try{
        const input = request.nextUrl.searchParams.get("input");

        if (!input) {
            return NextResponse.json([]);
        }
        const response = await fetch(
            "https://places.googleapis.com/v1/places:autocomplete",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Goog-Api-Key": process.env.GOOGLE_MAPS_API_KEY!,
                },
                body: JSON.stringify({
                    input,
                }),
            }
        );

        if (!response.ok) {
            return NextResponse.json(
                {
                    error: "Unable to retrieve suggestions. Try again later.",
                },
                {
                    status: response.status,
                }
            );
        }

        const data = await response.json();

        return NextResponse.json(data);
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