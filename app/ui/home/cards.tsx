"use client";

import { useEffect, useState } from "react";


import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  InboxIcon,
} from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import Image from 'next/image';
import LocalWeather from "./localWeather";

const iconMap = {
  sunny: BanknotesIcon,
  cloudy: UserGroupIcon,
};


const dayOfWeek = ['Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat'
]

export function Card({
  date,
  icon,
  alt,
  max,
  min,
}: {
  date: Date;
  icon: number;
  alt: string;
  max: number;
  min: number
}) {
  console.log("Rendering Card " + date)
  const formattedDate = dayOfWeek[date.getDay()] + ' ' + date.getDate() + '/' + (date.getMonth()+1)
  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <h3 className="ml-2 text-md font-medium text-center no-wrap">{formattedDate}</h3>
      <div className="flex items-center justify-center p-2">
        {icon? <Image width={100} height={100} src={'/icons/'+icon+'.png'} alt={alt} /> : null}
      </div>
      <p
        className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-2 text-center text-sm shrink-0`}
      >
        {max} / {min}
      </p>
    </div>
  );
}

type dailyInfo = {
  icon:number,
  weather:string,
  all_day:{
    temperature:number,
    temperature_max:number,
    temperature_min:number
  },
  summary:string
}

export function MainCard({current, converter, time}:{current:dailyInfo,converter:Function,time:Date}){
  return(
    <>
      <h3 className="ml-2 text-md font-medium text-center no-wrap">Condition at {time.getHours().toString().padStart(2, '0') + ':' + time .getMinutes().toString().padStart(2, '0')}</h3>
      <div className='grid grid-cols-3 text-center items-center'>
        
        <div className="flex items-center justify-center p-2">
          {current.icon? <Image width={100} height={100} src={'/icons/'+current.icon+'.png'} alt={current.weather} /> : null}
        </div>
        <div className={`${lusitana.className} flex flex-col items-center justify-center
            truncate rounded-xl bg-white py-2 text-center text-lg shrink-0`}>
          <p>{converter(current.all_day.temperature)}</p>
          <p>
          {converter(current.all_day.temperature_max)} / {converter(current.all_day.temperature_min)}
          </p>
        </div>
        <p>{current.summary.split('.')[0]}</p>
        
      </div>
    </>
  )
}

type Location = {
    latitude: number;
    longitude: number;
};

export function LocalCard({converter}:{converter:Function}){
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      if (!navigator.geolocation) {
          setError("Geolocation is not supported by your browser.");
          setLoading(false);
          return;
      }

      navigator.geolocation.getCurrentPosition(
          (position) => {
              setLocation({
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
              });
              setLoading(false);
          },
          (err) => {
              switch (err.code) {
                  case err.PERMISSION_DENIED:
                      setError("Location permission denied.");
                      break;
                  case err.POSITION_UNAVAILABLE:
                      setError("Location unavailable.");
                      break;
                  case err.TIMEOUT:
                      setError("Location request timed out.");
                      break;
                  default:
                      setError("Unable to retrieve your location.");
              }

              setLoading(false);
          }
      );
  }, []);

  if (loading) {
      return <p>Obtaining your location...</p>;
  }

  if (error) {
      return <p>{error}</p>;
  }

  return (
         <LocalWeather lat={location!.latitude} lon={location!.longitude} converter={converter} />
      
  );
}