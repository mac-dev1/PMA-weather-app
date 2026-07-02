import { DailyTemp, OpenWeatherDay, parseForecast } from "./definitions";


export function chunkDates(dates: string[], size = 10) {
    const starts = [];
    
    for (let i = 0; i < dates.length; i += size+1) {
        const start = new Date(dates[i]).getTime()
        const end = dates[i+10]? new Date(dates[i+size]).getTime():new Date(dates[dates.length - 1]).getTime()
        const count = (end-start)/1000/60/60/24 +1
        starts.push({start,count});
    }

    return starts;
}

export async function* fetchMissingWeather(
    lat: number,
    lon: number,
    dates: string[]
){
    
    const starts = chunkDates(dates, 9);
    
    for (const item of starts) {

        const response = await fetch(
            `/api/historicWeather?lat=${lat}&lon=${lon}&start=${item.start / 1000}&cnt=${item.count}`
        );

        const data = await response.json();

        const weather:DailyTemp[] = data.data
            .map((item: OpenWeatherDay&{timezone:string,timezone_offset:number}) => ({
                ...item,
                timezone: data.timezone,
                timezone_offset: data.timezone_offset,
            }))
            .map((item:OpenWeatherDay) => parseForecast(item, lat, lon));

        yield weather;
    }
    
}