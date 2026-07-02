'use client'

import { QueryForm } from "@/app/ui/historic/queryForm";
import Table from "@/app/ui/historic/table"
import { DailyTemp,Query } from "@/app/lib/definitions";
import { useState,useEffect } from "react";
import { createWeather, fetchWeather } from '@/app/lib/data';
import { findMissingDates } from "@/app/lib/dates";
import { fetchMissingWeather } from "@/app/lib/historical";
import { UnitButtonWrapper } from "@/app/ui/button";
import { deleteWeather, editWeather } from "@/app/lib/actions";
import { DeleteModal } from "@/app/ui/historic/delete-dialog";
import { EditModal } from "@/app/ui/historic/edit-dialog";
import { LocationMap } from "@/app/ui/historic/location-map";
import Youtube from "@/app/ui/historic/youtube_videos";

type TemperatureUnit = "metric" | "imperial" | "standard";

export default function Page() {
  
    const [data, setData] = useState<Array<Omit<DailyTemp,'dt'> & {dt:string}> | null>(null);
    const [location, setLocation] = useState<{latitude:number|undefined,longitude:number|undefined}>()
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [units,setUnits] = useState<TemperatureUnit>('metric')
    const [deleteItem,setDeleteItem] = useState<Omit<DailyTemp,'dt'>&{dt:string}|null>()
    const [editItem,setEditItem] = useState<Omit<DailyTemp,'dt'>&{dt:string}|null>()

    useEffect(()=>{
      const timer = setTimeout(()=>{
        if(typeof(data)==="object" && data && data.length>0){
          setLoading(false);
        }
      })
    },[data])

    async function handleSearch(query: Query) {
        setLoading(true);
        setError("");
        
        try{
          
          const placeResponse = await fetch(`/api/place-details?place=${encodeURIComponent(query.placeId)}`)
          const placeData = await placeResponse.json()
          const { latitude, longitude } = placeData.location;
          
          setLocation(placeData.location)
          
          if(latitude && longitude){
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

            const formattedWeather = weatherData
                .map(item => ({
                    ...item,
                    dt: item.dt.toISOString().split("T")[0],
                }));

            setData(formattedWeather);

            
            if(missing.length > 0){
                const existingDates = new Set(
                    weatherData.map(item => item.dt.toUTCString())
                );

                for await (const chunk of fetchMissingWeather(
                    latitude,
                    longitude,
                    missing
                )) {

                    const filtered = chunk.filter(
                        item => !existingDates.has(item.dt.toUTCString())
                    );

                    if (filtered.length === 0)
                        continue;

                    const created = await createWeather(filtered);

                    const newRows = filtered.map((item, idx) => ({
                        ...item,
                        id: created[idx].id,
                    }));

                    newRows.forEach(item =>
                        existingDates.add(item.dt.toUTCString())
                    );
                    
                    setData(prev => {

                        if (!prev)
                            return prev;

                        const map = new Map(
                            prev.map(item => [item.dt, item])
                        );

                        newRows.forEach(item => {
                            map.set(
                                item.dt.toISOString().split("T")[0],
                                {
                                    ...item,
                                    dt: item.dt.toISOString().split("T")[0],
                                }
                            );
                        });

                        return [...map.values()].sort(
                            (a, b) =>
                                new Date(a.dt).getTime() -
                                new Date(b.dt).getTime()
                        );
                    });
                }     
            }
            
          }else{
            setError("Unable to retrieve coordinates.")
          }
        }catch(error){
            setError("Unable to retrieve weather.");
            setData(null);
        }
    }

    const deleteDate = async (daily:Omit<DailyTemp,'dt'> & {dt:string})=>{
      setDeleteItem(daily)
      if(data){
          setData(data.filter(item => item.id !== daily.id))
        }
      }
    
    const editDate = async(daily:Omit<DailyTemp,'dt'> & {dt:string})=>{
      if(data){
        setData(current =>
        current?.map(item =>
            item.id === editItem?.id
                ? {
                    ...item,
                    humidity: daily.humidity,
                    pressure: daily.pressure,
                    wind_speed: daily.wind_speed,
                    clouds: daily.clouds
                }
                : item
        ) ?? null)
      }
      setEditItem(null)
    }

    

    return (
        <>
          <div className="flex gap-2 grid grid-cols-1 grid-rows-2 mybp:grid-cols-2  mybp:grid-rows-1">
            <div>
              <QueryForm onSearch={handleSearch} />
              <div className="py-2 grid grid-rows-2">
                <div>
                    <UnitButtonWrapper props={[{label:'K',value:'standard',selected:units ==='standard',onClick:setUnits},
                        {label:'°C',value:'metric',selected:units ==='metric',onClick:setUnits},
                        {label:'°F',value:'imperial',selected:units ==='imperial',onClick:setUnits}
                    ]}/>
                  </div>
              </div>
            </div>
            
            <div className="mb-2">
              {location && location.latitude && location.longitude &&(
              <LocationMap lat={location.latitude} lon={location.longitude}/>
              )
              }
            </div>
            
          </div>
          <div className="grid gap-2 grid-rows-2 grid-cols-1 mybp:grid-rows-1 mybp:grid-cols-[33%_66%]">
            {location && location.latitude && location.longitude && (
              <Youtube lat={location.latitude} lon={location.longitude}/>
            )}
            <Table
                data={data}
                loading={loading}
                error={error}
                units={units}
                deleteDate={(item) =>setDeleteItem(item)}
                editDate={(item)=>setEditItem(item)}
            />
          </div>
          {editItem &&(
            <EditModal 
                       item={editItem}
                       onClose={()=>setEditItem(null)}
                       onSave={async (daily:Omit<DailyTemp,'dt'>&{dt:string})=>{
                        const result =  await editWeather(daily)
                        if (result.success) {
                            editDate(daily);
                        }
                        return result
                      }}/>
          )}
          {deleteItem &&(
            <DeleteModal  onCancel={() => setDeleteItem(null)}
              onConfirm={async () => {
                  await deleteWeather(deleteItem);
                  deleteDate(deleteItem)
                  setDeleteItem(null);
              }}/>
          )}
        </>
    );
}