import { EditResult} from "@/app/lib/actions";
import { DailyTemp } from "@/app/lib/definitions";
import { useState } from "react";


type EditModalProps = { 
    item: Omit<DailyTemp, "dt"> & { dt: string };
    onClose: () => void; 
    onSave: (
        item: Omit<DailyTemp, "dt"> & { dt: string }
    ) => Promise<EditResult>; 
}; 

type ValidationErrors = {
    humidity?: string[];
    pressure?: string[];
    wind_speed?: string[];
    clouds?: string[];
    id?: string[];
};


export function EditModal({ item, onClose, onSave, }: EditModalProps) {
    
    const [result, setResult] = useState<EditResult>()
    const [humidity, setHumidity] = useState(Number(item.humidity)); 
    const [pressure, setPressure] = useState(Number(item.pressure)); 
    const [wind_speed, setWindSpeed] = useState(Number(item.wind_speed)); 
    const [clouds, setClouds] = useState(Number(item.clouds)); 
    
    return ( <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="w-full max-w-md rounded-xl bg-white shadow-2xl"> 
                    <div className="border-b px-6 py-4"> 
                        <h2 className="text-xl font-semibold"> Edit weather information </h2> 
                        <p className="mt-1 text-sm text-gray-500"> {item.dt} </p> 
                    </div> 
                    <div className="space-y-4 p-6">
                        {result && !result.success && result.message && (
                            <p className="text-red-500">{result.message}</p>
                        )} 
                        <div> 
                            <label className="mb-1 block text-sm font-medium"> Humidity (%) </label> 
                            <input type="number" min={0} max={100} 
                            value={humidity} onChange={(e) => {
                                setHumidity(Number(e.target.value))
                                setResult(undefined)
                            }
                             }
                            className="w-full rounded-md border px-3 py-2 focus:border-blue-500 focus:outline-none" /> 
                        </div> 
                        <div aria-live="polite" aria-atomic="true">
                            
                        {result && !result.success && result.errors?.humidity && (
                            <p className="mt-2 text-sm text-red-500">{result.errors.humidity}</p>
                        )}
                        </div> 
                        <div> 
                            <label className="mb-1 block text-sm font-medium"> Pressure (hPa) </label> 
                            <input type="number" min="850" max="1100"
                            value={pressure} onChange={(e) => {
                                setPressure(Number(e.target.value))
                                setResult(undefined)}
                                } 
                            className="w-full rounded-md border px-3 py-2 focus:border-blue-500 focus:outline-none" /> 
                        </div>
                        <div aria-live="polite" aria-atomic="true">
                            
                        {result && !result.success && result.errors?.pressure && (
                            <p className="mt-2 text-sm text-red-500">{result.errors.pressure}</p>
                        )}
                        </div> 
                        <div> 
                            <label className="mb-1 block text-sm font-medium"> Wind speed (m/s) </label> 
                            <input type="number" step="0.1" min={0} 
                            value={wind_speed} onChange={(e) =>{
                                 setWindSpeed(Number(e.target.value)) 
                                 setResult(undefined)}
                                } 
                            className="w-full rounded-md border px-3 py-2 focus:border-blue-500 focus:outline-none" /> 
                        </div> 
                        <div aria-live="polite" aria-atomic="true">
                            
                        {result && !result.success && result.errors?.wind_speed && (
                            <p className="mt-2 text-sm text-red-500">{result.errors.wind_speed}</p>
                        )}
                        </div> 
                        <div> 
                            <label className="mb-1 block text-sm font-medium"> Cloud cover (%) </label> 
                            <input type="number" min={0} max={100} 
                            value={clouds} onChange={(e) => {
                                setClouds(Number(e.target.value))
                                setResult(undefined)}
                             } 
                            className="w-full rounded-md border px-3 py-2 focus:border-blue-500 focus:outline-none"/> 
                        </div> 
                        <div aria-live="polite" aria-atomic="true">
                            
                        {result && !result.success && result.errors?.clouds && (
                            <p className="mt-2 text-sm text-red-500">{result.errors.clouds}</p>
                        )}
                        </div> 
                    </div> 
                    <div className="flex justify-end gap-3 border-t px-6 py-4"> 
                        <button onClick={onClose} 
                        className="rounded-md border px-4 py-2 transition hover:bg-gray-100" > Cancel </button> 
                        <button onClick={ async () => {
                            const result = await onSave({...item,humidity,pressure,wind_speed,clouds}) 
                            if (!result.success) {
                                setResult(result);
                                return;
                            }

                            onClose();
                            }
                        }
                        className="rounded-md bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700" > Save </button> 
                    </div> 
                </div> 
            </div> );
}