"use client";

import { useEffect, useState, useRef } from "react";

function isCoordinates(value: string): boolean {
    const parts = value.split(",");

    if (parts.length !== 2) return false;

    const lat = Number(parts[0].trim());
    const lon = Number(parts[1].trim());

    if (Number.isNaN(lat) || Number.isNaN(lon)) return false;

    return (
        lat >= -90 &&
        lat <= 90 &&
        lon >= -180 &&
        lon <= 180
    );
}


type SearchBarProps = {
    placeholder: string;
    setPlaceId: React.Dispatch<React.SetStateAction<string>>;
};

type GoogleSuggestion = {
    placePrediction:{
        placeId:string,
        text:{
            text:string
        }
    }
}

export default function SearchBar({
    placeholder,
    setPlaceId,
}: SearchBarProps) {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState<Array<GoogleSuggestion>>([]);
    const [error, setError] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        

        const timer = setTimeout(async () => {
            setError(null)
                if (query.length < 2) {
                    setSuggestions([]);
                    return;
                }

                if (isCoordinates(query)) {
                    setSuggestions([]);
                    return;
                }
            try{
                const response = await fetch(
                    `/api/autocomplete?input=${encodeURIComponent(query)}`
                );
                if (!response.ok) {
                    const error = await response.json();
                    setError(error.error);
                    return;
                }
                
                const data = await response.json();

                setSuggestions(data.suggestions ?? []);
            }catch {
                setError("Network error.");
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const select = async (id: string, place: string) => {
        // Cierra el menú inmediatamente
        setIsOpen(false);
        setSuggestions([]);

        if (isCoordinates(place)) {
            const [lat, lon] = place
                .split(",")
                .map((value) => Number(value.trim()));
            try{
                const response = await fetch(
                    `/api/placeFromCoords?lat=${lat}&lon=${lon}`
                );
                //throw Error()
                const data = await response.json();

                id = data.results[0].place_id;
                place = data.results[0].formatted_address;
            }catch{
                setError("Couldn't transform coordinates to place. Try again later.")
                setIsOpen(true)
                return
            }
        }
        setQuery(place);
        setPlaceId(id);
    };

    const showDropdown =
        isOpen &&
        query.length > 0 &&
        (isCoordinates(query) || suggestions.length > 0 || error);

    return (
        <div ref={wrapperRef} className="relative w-full">
            <input
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setPlaceId("");
                    setIsOpen(true);
                }}
                onFocus={() => setIsOpen(true)}
                placeholder={placeholder}
                className="w-full border rounded-md p-2"
            />

            {showDropdown && (
                <ul className="absolute left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-50">
                    {!error && (isCoordinates(query) && (
                        <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => select(query, query)}
                        >
                            {query}
                        </li>
                    ))}

                    {!error && (suggestions.map((place) => (
                        <li
                            key={place.placePrediction.placeId}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() =>
                                select(
                                    place.placePrediction.placeId,
                                    place.placePrediction.text.text
                                )
                            }
                        >
                            {place.placePrediction.text.text}
                        </li>
                    )))}
                    {error &&(
                        <li className="bg-red-100 p-4">{error}</li>
                    )

                    }
                </ul>
            )}
        </div>
    );
}