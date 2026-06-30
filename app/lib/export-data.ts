import { DailyTemp } from "./definitions";
import {jsPDF} from "jspdf";
import {autoTable} from "jspdf-autotable";

export function exportJSON(data:(Omit<DailyTemp, "dt"> & { dt: string; })[]){
    const blob = new Blob(
        [JSON.stringify(data, null, 2)],
        { type: "application/json" }
    );

    return blob
}

export function exportCSV(data:(Omit<DailyTemp, "dt"> & { dt: string; })[]){
    const headers = Object.keys(data[0]);

    const rows = data.map(item =>
        headers.map(h => item[h as keyof typeof item]).join(",")
    );

    const csv = [
        headers.join(","),
        ...rows
    ].join("\n");

    return csv
}

export function exportXML(data:(Omit<DailyTemp, "dt"> & { dt: string; })[]){
    const xml =
    `<?xml version="1.0"?>

    <weather>
    ${data.map(item=>`
        <record>
            <dt>${item.dt}</dt>
            <lat>${item.lat}</lat>
            <lon>${item.lon}</lon>
        </record>
    `).join("")}
    </weather>`;

    return xml
}

export function exportMD(data:(Omit<DailyTemp, "dt"> & { dt: string; })[]){
    const md = ""
    return md
}

export function exportPDF(data:(Omit<DailyTemp, "dt"> & { dt: string; })[]){
    const doc = new jsPDF();
    autoTable(doc,{
        head:[["Date","Lat","Lon","Temp"]],
        body:data.map(item=>[
            item.dt,
            item.lat,
            item.lon,
            item.max_temp
        ])
    });

    doc.save("weather.pdf");
}
