
import { YoutubeResponse } from "@/app/lib/definitions";
import { resolve } from "path";
import { useEffect, useState } from "react"
import Image from 'next/image';

type videoData={
    id: string; 
    title: string; 
    thumbnail: string;
}

type YoutubeResult = {
    success:true,
    data:YoutubeResponse}
  |{success:false, 
    error?:string,
    status?:number}


export default function Youtube({lat,lon}:{lat:number,lon:number}){
    const [videos,setVideos] = useState<videoData[]>()
    const [result,setResult] = useState<YoutubeResult>()


     useEffect(() => {
        async function loadVideos() {
            const response = await fetch(
                `/api/youtube?lat=${lat}&lon=${lon}`
            )
            
            const data:YoutubeResult = await response.json() 
            if(!data.success){
                setResult(data)
                return
            }
            setVideos(data.data.items.map((item)=>(
                {id:item.id.videoId,title:item.snippet.title,
                    thumbnail:item.snippet.thumbnails.default.url}
            )))
        }

        loadVideos();
    }, [lat, lon]);

    return(
    <div>
        {result && !result.success && result.error &&
         (
            <div className="bg-red-100 rounded"><p className="m-4 w-9/10">{result.error}</p></div>
        )}
        
            
        {videos &&(
            <ul className="max-h-96 overflow-y-auto list-none p-0 m-0">{
                 videos.map(video=>
                    <li key={video.id}>
                        <a href={"https://www.youtube.com/watch?v="+video.id}
                        title={video.title}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="flex items-center gap-4 rounded-lg p-2 hover:bg-gray-100 transition
                         hover:bg-gray-100">
                            <Image
                            width={96} height={64}
                                src={video.thumbnail}
                                alt={video.title}
                                className="hidden md:block rounded object-cover flex-shrink-0"
                            />

                            <span className="text-sm line-clamp-2">
                                {video.title}
                            </span>
                        </a>
                    </li>
                )
            }
            </ul>
            )}
        
    </div>)
}