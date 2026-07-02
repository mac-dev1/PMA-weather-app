"use server";

import postgres from "postgres";
import { revalidatePath } from "next/cache";
import { redirect } from 'next/navigation';
import { signIn,signOut } from '@/auth';
import { AuthError } from 'next-auth';
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
    lat: z.number(),
    lon: z.number(),
    dt: z.coerce.string(),
    humidity: z.coerce.number()
        .gte(0,{ message: 'Please enter a humidity value greater than or equal to 0.' })
        .lte(100,{ message: 'Please enter a humidity value lower than or equal to 100.' }),

    pressure: z.coerce.number()
        .gte(850,{ message: 'Please enter a pressure value greater than 850.' })
        .lte(1100,{ message: 'Please enter a pressure value lower than 1100.' }),

    wind_speed: z.coerce.number()
        .gte(0,{message: 'Please enter a wind speed value greater than 0'}),

    clouds: z.coerce.number()
        .gte(0,{message:'Please enter a clouds value greater than 0'})
        .lte(100,{message:'Please enter a clouds value lower than 100'}),
});

export type EditResult =
    | {
        success: true;
      }
    | {
        success: false;
        errors?: {
            humidity?: string[];
            pressure?: string[];
            wind_speed?: string[];
            clouds?: string[];
            id?: string[];
        };
        message?:string;
      };

export async function editWeather(item: Omit<DailyTemp,'dt'>&{dt:string}):Promise<EditResult>{
    console.log("Received item:",item)
    const validated = UpdateWeatherSchema.safeParse(item);

    if (!validated.success) {
        return {
            errors: validated.error.flatten().fieldErrors,
            success: false,
        };
    }

    const weather = validated.data;
    try{
        if(weather.id){
            await sql`
                UPDATE dailyTemp
                SET
                    humidity=${weather.humidity},
                    pressure=${weather.pressure},
                    wind_speed=${weather.wind_speed},
                    clouds=${weather.clouds}
                WHERE id=${weather.id}
            `;
        }else{
            await sql`
                UPDATE dailyTemp
                SET
                    humidity = ${weather.humidity},
                    pressure = ${weather.pressure},
                    wind_speed = ${weather.wind_speed},
                    clouds = ${weather.clouds}
                WHERE
                    lat = ${weather.lat}
                    AND lon = ${weather.lon}
                    AND dt = ${weather.dt}
            `;
        }
    }catch{
        return {
            success: false,
            message: "Unable to update the weather record. Please try again.",
        };
    }

    revalidatePath("/home/historic");
    console.log("Returning success")
    return {
        success: true,
    };
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}


export async function logout() {
    await signOut({ redirectTo: '/' });
}