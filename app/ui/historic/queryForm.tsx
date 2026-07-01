'use client';

import Search  from '@/app/ui/search';
import { useState, useEffect } from 'react';
import { Query } from '@/app/lib/definitions';
import UnitButton, { UnitButtonWrapper } from '../button';


type Props = {
    onSearch: (query: Query) => void;
};

export function QueryForm({ onSearch }: Props){
    const [placeId, setPlaceId] = useState('') // Mendoza
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [placeError, setPlaceError] = useState("")
    const [datesError,setDatesError] = useState("")
    const today = new Date().toISOString().split('T')[0]

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setPlaceError("")
        setDatesError("")
        // Validaciones
        if (!placeId) {
            setPlaceError("Please select a location.")
            return;
        }

        if (!startDate || !endDate) {
            setDatesError("Please select a date range.");
            return;
        }

        if (new Date(endDate) < new Date(startDate)) {
            setDatesError("Final date must be later than starter date.");
            return;
        }
        
        onSearch({
            placeId,
            start:startDate,
            end:endDate
        })


    }

    return (
        <>
        <form onSubmit={handleSubmit} className='grid grid-rows-2 gap-2'>
            <div>
            <Search placeholder='Enter city...' setPlaceId={setPlaceId} />
            {placeError && (
                <span
                    className="text-sm text-red-500 leading-tight"
                    aria-live="polite"
                    aria-atomic="true"
                >
                    {placeError}
                </span>
             )}</div>
                <div>
                    <div>
                        <input type="date" min="1980-01-01" max={today} value={startDate}
                        className='rounded-md mr-2'
                        onChange={(e)=>setStartDate(e.target.value)} />
                        <input type="date" min='1980-01-01' max={today} value={endDate}
                        className='rounded-md mr-2'
                        onChange={(e)=>setEndDate(e.target.value)} />
                    </div>
                    <div>
                        {datesError && (
                                <span
                                    className="block ml-2 text-sm text-red-500 leading-tight"
                                    aria-live="polite"
                                    aria-atomic="true"
                                >
                                    {datesError}
                                </span>
                            )}
                        <input type="submit" value="Search"
                        className='rounded-md px-2 py-2 transition-colors bg-blue-600 
                        hover:bg-blue-400 text-white hover:cursor-pointer' />
                    </div>
                </div>
           
        </form>
        </>
    )
}