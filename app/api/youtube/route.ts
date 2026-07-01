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

    const key = process.env.GOOGLE_MAPS_API_KEY 
    try{
        const searchResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&location=${lat},${lon}`+
        `&locationRadius=${"5km"}&maxResults=5&q=news&type=video&key=${key}`
        );
        console.log(searchResponse)
        if(!searchResponse.ok){
            throw Error(searchResponse.status.toString())
        }
        
        const data = await searchResponse.json()
        return NextResponse.json({success:true,data:data})
    }catch(err){
        return NextResponse.json({
            success: false,
            error: "Unable to search location related videos. Please try again.",
            status: err
        });
    }
}