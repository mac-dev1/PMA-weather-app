'use client'

import { QueryForm } from "@/app/ui/historic/queryForm";
import Table from "@/app/ui/historic/table"
import { DailyTemp,Query } from "@/app/lib/definitions";
import { useState } from "react";
import { createWeather, fetchWeather } from '@/app/lib/data';
import { findMissingDates } from "@/app/lib/dates";
import { fetchMissingWeather } from "@/app/lib/historical";
import { UnitButtonWrapper } from "@/app/ui/button";

type TemperatureUnit = "metric" | "imperial" | "standard";

export default function Page() {
  
    const [data, setData] = useState<Array<Omit<DailyTemp,'dt'> & {dt:string}> | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [units,setUnits] = useState<TemperatureUnit>('standard')

    async function handleSearch(query: Query) {
        setLoading(true);
        setError("");
        
        try{
          const placeResponse = await fetch(`/place-details?place=${encodeURIComponent(query.placeId)}`)
          const placeData = await placeResponse.json()
          
          const {latitude,longitude} = placeData.location

          const unixStart = new Date(query.start).getTime()
          const unixEnd = new Date(query.end).getTime()
          
          const weatherData = await fetchWeather({
              lat:Number(latitude.toFixed(6)),
              lon:Number(longitude.toFixed(6)),
              start:query.start,
              end:query.end
          })
          
          const missing = findMissingDates(weatherData.map((item)=>{
            return item.dt.toUTCString() //new Date(Number(item.dt)*1000).toUTCString()
          }),unixStart,unixEnd)

          let missingWeathers = Array<DailyTemp>()
          if(missing.length > 0){
            
            missingWeathers = await fetchMissingWeather(
                latitude,
                longitude,
                missing
            );
            
            
          }

          const allWeather = missingWeathers.length>0?[...weatherData,...missingWeathers]:weatherData

          console.log("allWeather:",allWeather)

          if(missingWeathers.length>0){
            missingWeathers.forEach(createWeather)
          }
                   
          const formattedWeather = allWeather.
            sort((a, b) => a.dt.getTime() - b.dt.getTime()).
              map((item) =>{
                const formattedDate = `${item.dt.getUTCDate()}/${item.dt.getUTCMonth()+1}/${item.dt.getUTCFullYear()}`
                return {...item,dt:formattedDate}
              }
            )
          console.log(formattedWeather)
          setData(formattedWeather)
          
        }catch(error){
            console.log("error")
            console.log(error)
            setError("Unable to retrieve weather.");
            setData(null);
        }

        setLoading(false);
    }

    return (
        <>
          <div className="grid grid-cols-2">
            <div>
              <QueryForm onSearch={handleSearch} />
            </div>
            <div className="py-2">
                    <UnitButtonWrapper props={[{label:'K',value:'standard',selected:units ==='standard',onClick:setUnits},
                        {label:'°C',value:'metric',selected:units ==='metric',onClick:setUnits},
                        {label:'°F',value:'imperial',selected:units ==='imperial',onClick:setUnits}
                    ]}/>
                
            </div>
          </div>
          <Table
              data={data}
              loading={loading}
              error={error}
              units={units}
          />
        </>
    );
}