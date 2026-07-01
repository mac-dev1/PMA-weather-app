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
            <timezone>${item.timezone}<
            <timezone_offset>${item.timezone_offset}</timezone_offset>
            <sunrise>${new Date(item.sunrise*1000).toString()}</sunrise>
            <sunset>${new Date(item.sunset*1000).toString()}</sunset>
            <moonrise>${new Date(item.moonrise*1000).toString()}</moonrise>
            <moonset>${new Date(item.moonset*1000).toString()}</moonset>
            <moon_phase>${item.moon_phase}</moon_phase>
            <day_temp>${item.day_temp}</day_temp>
            <min_temp>${item.min_temp}</min_temp>
            <max_temp>${item.max_temp}</max_temp>
            <night_temp>${item.night_temp}</night_temp>
            <eve_temp>${item.eve_temp}</eve_temp>
            <morn_temp>${item.morn_temp}</morn_temp>
            <pressure>${item.pressure}</pressure>
            <humidity>${item.humidity}</humidity>
            <wind_speed>${item.wind_speed}</wind_speed>
            <wind_deg>${item.wind_deg}</wind_deg>
            <clouds>${item.clouds}</clouds>
            <uvi>${item.uvi}</uvi>
        </record>
    `).join("")}
    </weather>`;

    return xml
}

export function exportMD(data:(Omit<DailyTemp, "dt"> & { dt: string; })[]){
    const header = `# Weather Records

Generated on: ${new Date().toISOString().slice(0, 10)}

|    Date    | Latitude | Longitude | Timezone | Sunrise | Sunset | Min Temp (K) | Max Temp (K) | Day Temp (K) | Night Temp (K) | Humidity (%) | Pressure (hPa) | Wind (m/s) | Wind Dir (°) | Clouds (%) | UV Index |
|---------|----------:|----------:|----------|---------:|--------:|-------------:|-------------:|-------------:|---------------:|-------------:|---------------:|-----------:|-------------:|-----------:|---------:|
`;

    const rows = data
        .map(item =>
            `| ${new Date(item.dt).toISOString().slice(0,10)} | ${Number(item.lat).toFixed(4)} | ${Number(item.lon).toFixed(4)} | ${item.timezone} | ${item.sunrise} | ${item.sunset} | ${Number(item.min_temp).toFixed(2)} | ${Number(item.max_temp).toFixed(2)} | ${Number(item.day_temp).toFixed(2)} | ${Number(item.night_temp).toFixed(2)} | ${item.humidity} | ${item.pressure} | ${item.wind_speed} | ${item.wind_deg} | ${item.clouds} | ${item.uvi} |`
        )
        .join("\n");

    return header + rows;
}

export function exportPDF(data:(Omit<DailyTemp, "dt"> & { dt: string; })[]){
    
    const doc = new jsPDF();

    const fields: {
        key: keyof Omit<DailyTemp, "id" | "timezone" | "timezone_offset" | "sunrise" | "sunset" | "moonrise" | "moonset" | "moon_phase" | "weather_icon" | "rain" | "snow"> | "dt";
        label: string;
    }[] = [
        { key: "lat", label: "Latitude" },
        { key: "lon", label: "Longitude" },
        { key: "max_temp", label: "Maximum Temp." },
        { key: "min_temp", label: "Minimum Temp." },
        { key: "morn_temp", label: "Morning Temp." },
        { key: "day_temp", label: "Day Temp." },
        { key: "eve_temp", label: "Evening Temp." },
        { key: "night_temp", label: "Night Temp." },
        { key: "clouds", label: "Cloud Cover (%)" },
        { key: "pressure", label: "Pressure (hPa)" },
        { key: "humidity", label: "Humidity (%)" },
        { key: "wind_speed", label: "Wind Speed (m/s)" },
        { key: "wind_deg", label: "Wind Direction (°)" },
    ];

    const datesPerTable = 5;

    for (let i = 0; i < data.length; i += datesPerTable) {

        const chunk = data.slice(i, i + datesPerTable);

        autoTable(doc, {
            head: [[
                "Field",
                ...chunk.map(item => item.dt)
            ]],

            body: fields.map(field => [
                field.label,
                ...chunk.map(item => String(item[field.key]))
            ]),

            styles: {
                fontSize: 9,
                cellPadding: 2,
                halign: "center",
                valign: "middle"
            },

            headStyles: {
                fillColor: [41, 128, 185]
            },

            columnStyles: {
                0: {
                    fontStyle: "bold",
                    halign: "left",
                    cellWidth: 45
                }
            },

            margin: { top: 20 }
        });

        if (i + datesPerTable < data.length) {
            doc.addPage();
        }
    }

    doc.save("weather.pdf");
}