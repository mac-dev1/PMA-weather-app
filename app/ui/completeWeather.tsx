'use client';
import { useState,useEffect } from "react";
import Search from '@/app/ui/search';
import Forecast5D from '@/app/ui/home/forecast5d'
import UnitButton from "./button";
import { LocalCard } from "./home/cards";

type Location ={
    latitude:number,
    longitude:number
}

type TemperatureUnit = "metric" | "imperial" | "standard";



export default function CompleteWeather(){
    const [placeId, setPlaceId] = useState("");
    const [location, setLocation] = useState<Location|null>(null);
    const [units, setUnits] = useState<TemperatureUnit>('metric')

    useEffect(()=>{ 
      if(!placeId){
        setLocation(null)
        return
      }
      
      const timer = setTimeout(async () =>{
        const response = await fetch(
            `/place-details?place=${encodeURIComponent(placeId)}`
        );

        const details = await response.json();

        setLocation(details.location)
        
      },100);

      return () => clearTimeout(timer);

    },[placeId])

    const convertTemperature = (temp: number) => {
            switch (units) {
                case "standard":
                    return (temp + 273.15).toFixed(1) + 'K';
    
                case "imperial":
                    return (temp * 9 / 5 + 32).toFixed(1) + '°F';
    
                default:
                    return temp +'°C';
            }
        };

    return(
        <>
        <div className="grid grid-rows-2 mybp:grid-rows-1 mybp:grid-cols-2 items-center justify-center">
                <p>Showing temperature in 
                    <UnitButton
                        label="K"
                        value="standard"
                        selected={units === "standard"}
                        onClick={setUnits}
                    />
                    <UnitButton
                        label="°C"
                        value="metric"
                        selected={units === "metric"}
                        onClick={setUnits}
                    />

                    <UnitButton
                        label="°F"
                        value="imperial"
                        selected={units === "imperial"}
                        onClick={setUnits}
                    />
                </p>
                <LocalCard converter={convertTemperature}/>
        </div>
        
        <div className="my-4 flex items-center justify-between gap-2 md:my-8">
            <Search placeholder="Search a city..." setPlaceId={setPlaceId} />
        </div>
        {location && (
            <Forecast5D lat={location?.latitude.toString()} lon={location?.longitude.toString()} units={units} converter={convertTemperature} />
        )}
        </>
    )
}