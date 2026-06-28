import { setOptions, importLibrary } from '@googlemaps/js-api-loader';

setOptions({
    key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
});

export async function loadPlacesLibrary() {
    return await importLibrary("places");
}