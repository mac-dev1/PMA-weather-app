import { useEffect, useState } from 'react'; 
import Image from 'next/image';

type googleWeather = {
    weatherCondition:{
        iconBaseUri: string,
        description: {
        text: string
        },
    },
    temperature: {
        degrees: number,
    }
}

export default function LocalWeather({lat,lon,converter}:{lat:number,lon:number,converter:Function}){
    const [temperate, setTemperate] = useState<googleWeather|null>(null)
    const [error, setError] = useState<string | null>(null);

    useEffect(()=>{
        const fetchLocalWeather = async () =>{
            try{
                const response = await fetch(`/api/localWeather?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}`)
                if (!response.ok) {
                    const error = await response.json();
                    setError(error.error);
                    return;
                }
                const data = await response.json()
                setTemperate(data)
            }catch {
                setError("Network error.");
            }
        }

        fetchLocalWeather()
    },[lat,lon])

    if (error) {
        return (
            <div className="rounded-xl bg-red-100 p-4">
                {error}
            </div>
        );
    }

    if(!temperate){
        return
    }

    if(!temperate.weatherCondition){
        return <p>Loading weather...</p>
    }

    return (
            <>
            
            <div className='grid grid-cols-2 bg-gray-100 rounded-md p-2 '>
                <Image src={temperate.weatherCondition.iconBaseUri + '.svg'} 
                alt={temperate.weatherCondition.description.text}
                height={100} width={100}/>
                <div className='grid grid-rows-3  mx-2'>
                    <p>Local weather</p>
                    <p>{converter(temperate.temperature.degrees)}</p>
                    <p>{temperate.weatherCondition.description.text}</p>
                </div>
                
            </div>
            </>
        
    )
}

