"use client";

import { useEffect, useRef, useState } from "react";
import { DailyTemp } from "@/app/lib/definitions"
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline"
import  { exportCSV, exportJSON, exportMD, exportPDF, exportXML} from "@/app/lib/export-data";

type ExportProps = {
    data: (Omit<DailyTemp,"dt">&{dt:string})[]
}

export function ExportButton(data:ExportProps){
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
    //download(csv,"weather.csv","text/csv");
    return(
        <div ref={menuRef} className="relative inline-block">
            <button
                onClick={() => setOpen(!open)}
                className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                title="Download"
            >
                Export ▼
            </button>

            {open && (
                <div className="absolute  mt-2  rounded-md border bg-white shadow-lg z-50">
                    <button className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                    onClick={()=>exportPDF(data.data)}>PDF</button>
                    <button className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                     onClick={()=>download(exportXML(data.data),
                        'weather.xml',"text/xml")
                     }>XML</button>
                    <button className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                     onClick={()=>download(exportMD(data.data),
                        "weather.md","text/mark-down")
                     }>MD</button>
                    <button className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                     onClick={()=>download(exportJSON(data.data),
                     "weather.json","text/json")}>JSON</button>
                    <button className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                     onClick={()=>download(exportCSV(data.data),
                        "weather.csv","text/xml")
                     }>CSV</button>
                </div>
            )}
        </div>
    )
}