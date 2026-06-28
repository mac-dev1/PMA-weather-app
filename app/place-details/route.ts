import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {

    const place = request.nextUrl.searchParams.get("place");

    if (!place) {
        return NextResponse.json(
            { error: "Missing place" },
            { status: 400 }
        );
    }

    const response = await fetch(
        `https://places.googleapis.com/v1/places/${place}`,
        {
            headers: {
                "X-Goog-Api-Key": process.env.GOOGLE_MAPS_API_KEY!,
                "X-Goog-FieldMask":
                    "displayName,formattedAddress,location",
            },
        }
    );

    const data = await response.json();

    return NextResponse.json(data);
}