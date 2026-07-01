"use client";

import { useEffect, useRef, useState } from "react";
import { DailyTemp } from "@/app/lib/definitions"
import  { exportCSV, exportJSON, exportMD, exportPDF, exportXML} from "@/app/lib/export-data";
import { convertTemp } from "@/app/lib/utils";
import { ArrowDownIcon } from "@heroicons/react/24/outline";

type ExportProps = {
    data: (Omit<DailyTemp,"dt">&{dt:string})[],
    units:"metric" | "standard" | "imperial"
}

export function ExportButton({data,units}:ExportProps){
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function download(
        content:string|Blob,
        filename:string,
        mime:string
    ){
        const blob=new Blob([content],{type:mime});

        const url=URL.createObjectURL(blob);

        const a=document.createElement("a");

        a.href=url;

        a.download=filename;

        a.click();

        URL.revokeObjectURL(url);
    }
    
    const exportData = data.map(item=>({
        ...item,
        lat:Number(item.lat.toFixed(4)),
        lon:Number(item.lon.toFixed(4)),
        max_temp:convertTemp(item.max_temp,units),
        min_temp:convertTemp(item.min_temp,units),
        morn_temp:convertTemp(item.morn_temp,units),
        day_temp:convertTemp(item.day_temp,units),
        eve_temp:convertTemp(item.eve_temp,units),
        night_temp:convertTemp(item.night_temp,units)
    }))

    return(
        <div ref={menuRef} className="relative inline-block">
            <button
                onClick={() => setOpen(!open)}
                className="rounded-md bg-blue-600 p-1 text-white hover:bg-blue-700"
                title="Download"
            >
                <ArrowDownIcon className="w-5 p-0 text-white"/>
            </button>


            {open && (
                <div className="absolute  mt-2  rounded-md border bg-white shadow-lg z-50">
                    <button className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                    onClick={()=>{
                        console.log(exportData)
                        exportPDF(exportData)}}>PDF</button>
                    <button className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                     onClick={()=>download(exportXML(exportData),
                        'weather.xml',"text/xml")
                     }>XML</button>
                    <button className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                     onClick={()=>download(exportMD(exportData),
                        "weather.md","text/mark-down")
                     }>MD</button>
                    <button className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                     onClick={()=>download(exportJSON(exportData),
                     "weather.json","text/json")}>JSON</button>
                    <button className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                     onClick={()=>download(exportCSV(exportData),
                        "weather.csv","text/xml")
                     }>CSV</button>
                </div>
            )}
        </div>
    )
}