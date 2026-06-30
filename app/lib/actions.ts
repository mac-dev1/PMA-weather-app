"use server";

import postgres from "postgres";
import { revalidatePath } from "next/cache";
import { redirect } from 'next/navigation';
import { DailyTemp } from "./definitions";
import { z } from 'zod';

const sql = postgres(process.env.POSTGRES_URL!, {
    ssl: "require",
});

const DeleteWeatherSchema = z.object({
        id: z.string(),
        lat: z.coerce.number(),
        lon: z.coerce.number(),
        dt: z.coerce.date(),
        });

export async function deleteWeather(item: Omit<DailyTemp,'dt'>&{dt:string}) {
    console.log(item)
    const weather = DeleteWeatherSchema.parse(item)
    console.log(weather)
    
    if(item.id){
        await sql `
            DELETE FROM dailyTemp
            WHERE id = ${item.id}
        `;
    }else{
        await sql `
            DELETE FROM dailyTemp
            WHERE lat=${item.lat} AND lon=${item.lon} AND dt=${item.dt.split('T')[0]}`
    }
    revalidatePath("/home/historic");
}

const UpdateWeatherSchema = z.object({
    id: z.string(),

    humidity: z.coerce.number()
        .min(0)
        .max(100),

    pressure: z.coerce.number()
        .min(850)
        .max(1100),

    wind_speed: z.coerce.number()
        .min(0),

    clouds: z.coerce.number()
        .min(0)
        .max(100),
});

export async function editWeather(item: Omit<DailyTemp,'dt'>&{dt:string}) {

    const weather = UpdateWeatherSchema.parse(item);

    await sql`
        UPDATE dailyTemp
        SET
            humidity = ${weather.humidity},
            pressure = ${weather.pressure},
            wind_speed = ${weather.wind_speed},
            clouds = ${weather.clouds}
        WHERE id = ${weather.id}
    `;

    revalidatePath("/home/historic");
}