'use server'

import postgres, { Row, RowList } from 'postgres';
import { DailyTemp } from './definitions';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

export async function fetchWeather({lat,lon,start,end}:{lat:number,lon:number,start:string,end:string}){
  console.log("Query limits:",lat-0.05,lat+0.05,lon-0.05,lon+0.05)
  console.log("Dates:",start,end)
  try{
    const data = await sql<DailyTemp[]>`
    SELECT * 
    FROM dailyTemp
    WHERE 
    (lat BETWEEN ${lat-0.05} AND ${lat+0.05}) AND
    (lon BETWEEN ${lon-0.05} AND ${lon+0.05}) AND
    (dt BETWEEN ${start} AND ${end})
    ORDER BY dt`;
    
   return data
  }catch(error){
    console.error('Database error:',error)
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function createWeather(weatherData:DailyTemp[]){
  console.log(weatherData)
  const created = await sql `
  INSERT INTO dailytemp (lat,lon,timezone,timezone_offset,dt,sunrise,sunset,moonrise,moonset,
  moon_phase,day_temp,min_temp,max_temp,night_temp,eve_temp,morn_temp,pressure,humidity,
  wind_speed,wind_deg,clouds,uvi)
  VALUES ${sql(weatherData.map(weather =>[
            weather.lat,
            weather.lon,
            weather.timezone,
            weather.timezone_offset,
            weather.dt.toISOString(),
            weather.sunrise,
            weather.sunset,
            weather.moonrise,
            weather.moonset,
            weather.moon_phase,
            weather.day_temp,
            weather.min_temp,
            weather.max_temp,
            weather.night_temp,
            weather.eve_temp,
            weather.morn_temp,
            weather.pressure,
            weather.humidity,
            weather.wind_speed,
            weather.wind_deg,
            weather.clouds,
            weather.uvi
  ])
  )} ON CONFLICT (lat, lon, dt)
  DO NOTHING
  RETURNING *;
  `
  return created
}

