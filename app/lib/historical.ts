import { DailyTemp, parseForecast } from "./definitions";


export function chunkDates(dates: string[], size = 10) {
    const starts = [];
    
    for (let i = 0; i < dates.length; i += size) {
        const start = new Date(dates[i]).getTime()
        const end = dates[i+10]? new Date(dates[i+10]).getTime():new Date(dates[dates.length - 1]).getTime()
        const count = (end-start)/1000/60/60/24 +1
        starts.push({start,count});
    }

    return starts;
}

export async function fetchMissingWeather(
    lat: number,
    lon: number,
    dates: string[]
){
    
    const starts = chunkDates(dates, 10);
    
    const responses = await Promise.all(
        starts.map(async (item) => {                                                   // expect time in seconds
            const response = await fetch(`/historicWeather?lat=${lat}&lon=${lon}&start=${item.start/1000}&cnt=${item.count}`);
            const data = await response.json()
            return data.data.map((item:DailyTemp) =>{
                return {...item,timezone:data.timezone,timezone_offset:data.timezone_offset,}
        });
        })
    );
    return responses.flat().map(item => parseForecast(item,lat,lon));
    
}