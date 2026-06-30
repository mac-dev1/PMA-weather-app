'use client'

import { QueryForm } from "@/app/ui/historic/queryForm";
import Table from "@/app/ui/historic/table"
import { DailyTemp,Query } from "@/app/lib/definitions";
import { useState } from "react";
import { createWeather, fetchWeather } from '@/app/lib/data';
import { findMissingDates } from "@/app/lib/dates";
import { fetchMissingWeather } from "@/app/lib/historical";
import { UnitButtonWrapper } from "@/app/ui/button";
import { deleteWeather, editWeather } from "@/app/lib/actions";
import { DeleteModal } from "@/app/ui/historic/delete-dialog";
import { EditModal } from "@/app/ui/historic/edit-dialog";
import { ExportButton } from "@/app/ui/historic/export-button";

type TemperatureUnit = "metric" | "imperial" | "standard";

export default function Page() {
  
    const [data, setData] = useState<Array<Omit<DailyTemp,'dt'> & {dt:string}> | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [units,setUnits] = useState<TemperatureUnit>('standard')
    const [deleteItem,setDeleteItem] = useState<Omit<DailyTemp,'dt'>&{dt:string}|null>()
    const [editItem,setEditItem] = useState<Omit<DailyTemp,'dt'>&{dt:string}|null>()

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
            
            if(missingWeathers.length>0){
              const removableDates = new Set(weatherData.map(
              existent=>existent.dt.toUTCString()))
              missingWeathers = missingWeathers.filter(newWeather => !removableDates.has(newWeather.dt.toUTCString()))
              const created = await createWeather(missingWeathers)
              missingWeathers = missingWeathers.map((item,idx)=>{return {...item,id:created[idx].id}})
            }            
          }

          const allWeather = missingWeathers.length>0?[...weatherData,...missingWeathers]:weatherData          
          
          const formattedWeather = allWeather.
            sort((a, b) => a.dt.getTime() - b.dt.getTime()).
              map((item) =>{
                const formattedDate = item.dt.toISOString().split('T')[0]//`${item.dt.getUTCDate()}/${item.dt.getUTCMonth()+1}/${item.dt.getUTCFullYear()}`
                return {...item,dt:formattedDate}
              }
            )
            
          setData(formattedWeather)
        }catch(error){
            console.log("error")
            console.log(error)
            setError("Unable to retrieve weather.");
            setData(null);
        }
        console.log(data)
        setLoading(false);
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
            {data &&(
            <ExportButton data={data}/>
          )}
          </div>
          
          <Table
              data={data}
              loading={loading}
              error={error}
              units={units}
              deleteDate={(item) =>setDeleteItem(item)}
              editDate={(item)=>setEditItem(item)}
          />
          {editItem &&(
            <EditModal 
                       item={editItem}
                       onClose={()=>setEditItem(null)}
                       onSave={async (daily:Omit<DailyTemp,'dt'>&{dt:string})=>{
                        await editWeather(daily)
                        editDate(daily)
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