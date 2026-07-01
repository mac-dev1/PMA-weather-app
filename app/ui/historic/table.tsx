import { DailyTemp } from "@/app/lib/definitions"
import { throwDeprecation } from "process";
import { TrashIcon,PencilSquareIcon } from "@heroicons/react/24/outline";
import { deleteWeather } from "@/app/lib/actions";
import { ExportButton } from "./export-button";
import { useEffect, useRef, useState } from "react";

type TableProps={
    data:Array<Omit<DailyTemp,'dt'>&{dt:string}>|null;
    loading:Boolean;
    error:string;
    units:"metric" | "standard" | "imperial";
    deleteDate: (
        item: Omit<DailyTemp, "dt"> & { dt: string }
    ) => void | Promise<void>;
    editDate:(
        item: Omit<DailyTemp, "dt"> & { dt: string }
    ) => void | Promise<void>
}

export default function HistoricTable({data,loading,error,units,deleteDate,editDate}:TableProps){
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const tableRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!tableRef.current) return;

        function handleClickOutside(event: MouseEvent) {
            if (
                tableRef.current &&
                !tableRef.current.contains(event.target as Node)
            ) {
                setSelectedId(null);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    
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
        <div className="relative">
            <div ref={tableRef}>
                {data &&(
                    <div className="absolute top-[-10] left-[-10] z-10 ">
                        <ExportButton data={data} units={units}/>
                    </div>
                )}
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
                                <th>Edit</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody className="text-center border">
                            {
                                data.map((item)=>
                                <tr key={item.id}  onClick={() => setSelectedId(item.id)}
                                className={`cursor-pointer transition-colors ${selectedId === item.id ? "bg-indigo-100" : "hover:bg-gray-100"}`} >
                                    <td className="border">{item.dt.split('T')[0].replaceAll('-','/').split('/').reverse().join('/')}</td>
                                    <td className="border">{Number(item.lat).toFixed(4)}</td>
                                    <td className="border">{Number(item.lon).toFixed(4)}</td>
                                    <td className="border">{convertTemp(item.max_temp)}</td>
                                    <td className="border">{convertTemp(item.min_temp)}</td>
                                    <td className="border">{item.clouds}</td>
                                    <td className="border">{item.wind_speed}</td>
                                    <td className="border">{item.pressure}</td>
                                    <td>
                                        <button onClick={(e) =>{
                                            e.stopPropagation();
                                            editDate(item)}}>
                                            <PencilSquareIcon className="w-4" />
                                        </button>
                                    </td>
                                    <td>
                                        <button onClick={(e) =>{
                                            e.stopPropagation();
                                             deleteDate(item)}}>
                                            <TrashIcon className="w-4"/>
                                        </button>
                                    </td>
                                </tr>
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        
    )
}