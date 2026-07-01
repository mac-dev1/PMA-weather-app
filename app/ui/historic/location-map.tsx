'use client'

import {APIProvider, Map, useMap, MapCameraChangedEvent, AdvancedMarker, Pin } from '@vis.gl/react-google-maps'
import { useEffect, useState } from 'react';

function MapUpdater({ lat, lon }: { lat: number; lon: number }) {
        const map = useMap();

        useEffect(() => {
            if (!map) return;

            map.panTo({ lat, lng: lon });
            map.setZoom(13);
        }, [map, lat, lon]);

        return null;
    }

export function LocationMap({lat,lon}:{lat:number,lon:number}){
    
    
    const poi = {key:'Location',location:{lat:Number(lat),lng:Number(lon) }}
    
    return(
        
        <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!} >
            
                <Map
                key={`${lat}-${lon}`}
                defaultZoom={13}
                defaultCenter={ {  lat: Number(lat), lng: Number(lon) } }
                mapId='c0d06d09c51ddc57617e3727'
                >
                    <MapUpdater lat={Number(lat)} lon={Number(lon)} />
                    <AdvancedMarker
                    key={poi.key}
                    position={poi.location}>
                        <Pin background={'#FBBC04'} glyphColor={'#000'} borderColor={'#000'} />
                    </AdvancedMarker>
                </Map>
        </APIProvider>
        

    )

}