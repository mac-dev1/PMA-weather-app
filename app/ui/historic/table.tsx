import { DailyTemp } from "@/app/lib/definitions"
import { throwDeprecation } from "process";

type TableData={
    data:Array<Omit<DailyTemp,'dt'>&{dt:string}>|null,
    loading:Boolean,
    error:string,
    units:string
}

export default function HistoricTable({data,loading,error,units}:TableData){
    if (loading)
        return <p>Fetching...</p>;

    if (error)
        return <p>{error}</p>;

    if (data === null)
        return <p>No search has been performed yet.</p>;

    if (data.length === 0)
        return <p>No records found.</p>;
    
    const convertTemp = (temp:number) =>{
        switch (units){
            case "metric":
                return (temp-273.15).toFixed(2) + '°C'
            case "imperial":
                return ((temp-273.15)*9/5 +32).toFixed(2) + '°F'
            default:
                return temp + 'K'
        }
    }

    return(
        <div className="grid overflow-x-auto rounded-lg border">
            <table className="min-w-[1100px] table-auto">
                <thead>
                    <tr className="bg-gray-100">
                        <th>Day</th>
                        <th>Latitude</th>
                        <th>Longitude</th>
                        <th>Day Maximum</th>
                        <th>Day Minimum</th>
                        <th>Clouds</th>
                        <th>Wind</th>
                        <th>Pressure</th>
                    </tr>
                </thead>
                <tbody className="text-center border">
                    {
                        data.map((item)=>
                        <tr key={item.dt} >
                            <td className="border">{item.dt}</td>
                            <td className="border">{item.lat.toString().padEnd(7,'0')}</td>
                            <td className="border">{item.lon.toString().padEnd(8,'0')}</td>
                            <td className="border">{convertTemp(item.max_temp)}</td>
                            <td className="border">{convertTemp(item.min_temp)}</td>
                            <td className="border">{item.clouds}</td>
                            <td className="border">{item.wind_speed}</td>
                            <td className="border">{item.pressure}</td>
                        </tr>
                        )
                    }
                </tbody>
            </table>
        </div>
    )
}