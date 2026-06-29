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
    const today = new Date().toISOString().split('T')[0]

    useEffect(()=>{
        if(startDate === "" || endDate===""){
            return
        }

        const unixStart = new Date(startDate).getTime()
        const unixEnd = new Date(endDate).getTime()
        
        if( unixEnd - unixStart < 0){
            alert("Final date must be later than starter date")
            setStartDate("")
            setEndDate("")
            return
        }


    },[startDate,endDate])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();

        // Validaciones
        if (!placeId) {
            console.log("Please select a location.");
            return;
        }

        if (!startDate || !endDate) {
            console.log("Please select a date range.");
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
            <Search placeholder='Enter city...' setPlaceId={setPlaceId} />
                <div>
                    <input type="date" min="1980-01-01" max={today} value={startDate}
                    className='rounded-md mr-2'
                    onChange={(e)=>setStartDate(e.target.value)}/>
                    <input type="date" min='1980-01-01' max={today} value={endDate}
                    className='rounded-md mr-2'
                    onChange={(e)=>setEndDate(e.target.value)}/>
                    <input type="submit" value="Search"
                    className='rounded-md px-2 py-2 transition-colors bg-blue-600 
                    hover:bg-blue-400 text-white hover:cursor-pointer'/>
                </div>
           
        </form>
        </>
    )
}