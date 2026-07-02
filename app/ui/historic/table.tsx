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
            <div ref={tableRef} className="h-full">
                {data &&(
                    <div className="absolute top-[-10] left-[-10] z-30 ">
                        <ExportButton data={data} units={units}/>
                    </div>
                )}
                <div className="max-h-[20rem] md:max-h-[30rem] overflow-auto rounded-lg border">
                    <table className="min-w-[1100px] overflow-x-auto table-fixed border-separate border-spacing-0">
                        <thead>
                            <tr>
                                <th className="sticky top-0 left-0 z-20 w-35 bg-gray-100 border-r-2 border-r-black">Day</th>
                                <th className="sticky top-0 z-4 bg-gray-100">Latitude</th>
                                <th className="sticky top-0 z-4 bg-gray-100">Longitude</th>
                                <th className="sticky top-0 z-4 bg-gray-100">Day Maximum</th>
                                <th className="sticky top-0 z-4 bg-gray-100">Day Minimum</th>
                                <th className="sticky top-0 z-4 bg-gray-100">Clouds</th>
                                <th className="sticky top-0 z-4 bg-gray-100">Wind</th>
                                <th className="sticky top-0 z-4 bg-gray-100">Pressure</th>
                                <th className="sticky right-20 top-0 z-20 bg-gray-200 w-20 border-l-2 border-l-black">Edit</th>
                                <th className="sticky right-0 top-0 z-20 bg-gray-200 w-20 ">Delete</th>
                            </tr>
                        </thead>
                        <tbody className="text-center border">
                            {
                                data.map((item)=>
                                <tr key={item.id}  onClick={() => setSelectedId(item.id)}
                                className={`cursor-pointer transition-colors ${selectedId === item.id ? "bg-indigo-100" : "hover:bg-gray-100"}`} >
                                    <td className="sticky left-0 bg-white w-35 border border-r-2 border-r-black">{item.dt.split('T')[0].replaceAll('-','/').split('/').reverse().join('/')}</td>
                                    <td className="border">{Number(item.lat).toFixed(4)}</td>
                                    <td className="border">{Number(item.lon).toFixed(4)}</td>
                                    <td className="border">{convertTemp(item.max_temp)}</td>
                                    <td className="border">{convertTemp(item.min_temp)}</td>
                                    <td className="border">{item.clouds}</td>
                                    <td className="border">{item.wind_speed}</td>
                                    <td className="border">{item.pressure}</td>
                                    <td className={`
                                                sticky right-20 bg-white z-10 border 
                                                border-l-2 border-l-black
                                            `}>
                                        <button onClick={(e) =>{
                                            e.stopPropagation();
                                            editDate(item)}}>
                                            <PencilSquareIcon className="w-4" />
                                        </button>
                                    </td>
                                    <td className={`
                                                sticky right-0 bg-white z-10 border
                                            ${selectedId === item.id
                                                ? "bg-indigo-100"
                                                : "bg-white hover:bg-gray-100"}
                                        `}>
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