'use client'

import {useState, useEffect, useCallback} from 'react';
import { Card, MainCard } from "@/app/ui/home/cards";
import { Forecast } from "@/app/lib/definitions"

export default function Forecast5D({lat, lon,units,converter}:{lat:string,lon:string,units:"metric"|"standard"|"imperial",converter:Function}){
   const [forecast, setForecast] = useState<Forecast|null>(null);
   const [time, setTime] = useState(new Date())
   const [error, setError] = useState<string|null>(null)

   const loadForecast = useCallback(async () => {

            try{
                const response = await fetch(
                    `/api/weather?lat=${lat}&lon=${lon}`
                );
                if(!response.ok){
                    const err = await response.json()
                    setError(err.detail)
                    setForecast(null)
                    return
                }
                
                const data = await response.json();
                setForecast(data);
                setTime(new Date())
            }catch(err:unknown){
                setForecast(null)
                setError("Network error.")
            }
        },[lat,lon])

    useEffect(() => {
        if(!lat || !lon){
            return
        }
        const timer = setTimeout(async ()=>{
            loadForecast()
        },100)
        return () => clearTimeout(timer)
    }, [lat,lon,loadForecast]);

    if(error){
        return (
            <div className="rounded-xl bg-red-100 p-4">
                {error}
            </div>
        );
    }

    return(
        <>
        {forecast &&(
            <>
        <button className='rounded-md px-2 ml-2 transition-colors bg-blue-600 text-white hover:bg-blue-400'
        onClick={loadForecast}>Update</button>   
        <div className="rounded-xl bg-gray-50 p-2 shadow-sm my-2 w-1/2  mx-auto">
            <MainCard current={forecast.daily.data[0]} converter={converter} time={time}/>
        </div>
        <div className="grid gap-6 grid-rows-5 mybp:grid-cols-5">
            {forecast.daily.data.slice(1,6).map((item) =>
                <Card key={item.day} date={new Date(item.day+'T00:00:00')} 
                icon={item.icon} alt={item.weather} max={converter(item.all_day.temperature_max)}
                min={converter(item.all_day.temperature_min)} />
            
            )}
        </div>
        </>
       )}
        </>
        )
}