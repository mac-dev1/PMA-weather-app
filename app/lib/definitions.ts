
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type DailyTemp = {
  id: string,
  lat: number,
  lon: number,
  timezone: string,
  timezone_offset: number,
  dt: Date,
  sunrise: number,
  sunset: number,
  moonrise: number,
  moonset: number,
  moon_phase: number,
  day_temp: number,
  min_temp: number,
  max_temp: number,
  night_temp: number,
  eve_temp: number,
  morn_temp:number,
  pressure: number,
  humidity: number,
  wind_speed: number,
  wind_deg: number,
  weather_icon: string,
  clouds: number,
  rain: number,
  snow: number,
  uvi:number
}

type Wind = {
    speed: number;
    dir: string;
    angle: number;
};

type CloudCover = {
    total: number;
};

type Precipitation = {
    total: number;
    type: string;
};

type Period = {
    weather: string;
    icon: number;
    temperature: number;
    temperature_min: number;
    temperature_max: number;
    wind: Wind;
    cloud_cover: CloudCover;
    precipitation: Precipitation;
};

export type ForecastDay = {
    day: string;
    weather: string;
    icon: number;
    summary: string;
    all_day: Period;
    morning: Period | null;
    afternoon: Period | null;
    evening: Period | null;
};

export type Forecast = {
  daily:{
    data: Array<ForecastDay>
  }
}

export type Query = {
    placeId: string;
    start: string;
    end: string;
};

export type OpenWeatherDay ={
    id:string,
    dt: number,
    timezone:string,
    timezone_offset:number,
    sunrise: number,
    sunset: number,
    moonrise: number,
    moonset: number,
    moon_phase: number,
    temp: {
        day: number,
        min: number,
        max: number,
        night: number,
        eve: number,
        morn: number,
    },
    feels_like: {
        day: number,
        night: number,
        eve: number,
        morn: number,
    },
    pressure: number,
    humidity: number,
    wind_speed: number,
    wind_deg: number,
    weather: null,
    clouds:number,
    rain:number|null,
    snow:number|null,
    uvi: number
}

export function parseForecast(forecast:OpenWeatherDay,lat:number,lon:number){
    const parsed:DailyTemp = {
      id: forecast.id,
      lat: lat,
      lon: lon,
      timezone: forecast.timezone,
      timezone_offset: forecast.timezone_offset,
      dt: new Date(forecast.dt*1000),
      sunrise: forecast.sunrise,
      sunset: forecast.sunset,
      moonrise: forecast.moonrise,
      moonset: forecast.moonset,
      moon_phase: forecast.moon_phase,
      day_temp: forecast.temp.day,
      min_temp: forecast.temp.min,
      max_temp: forecast.temp.max,
      night_temp: forecast.temp.night,
      eve_temp: forecast.temp.eve,
      morn_temp: forecast.temp.morn,
      pressure: forecast.pressure,
      humidity: forecast.humidity,
      wind_speed: forecast.wind_speed,
      wind_deg: forecast.wind_deg,
      weather_icon: "",
      clouds: forecast.clouds,
      rain: forecast.rain?forecast.rain:0,
      snow: forecast.snow?forecast.snow:0,
      uvi:forecast.uvi
    }
    return parsed
}

export type YoutubeResponse ={
  kind: string,
  etag: string,
  nextPageToken: string,
  regionCode: string,
  pageInfo: { totalResults: number, resultsPerPage: number },
  items:{
      kind: string,
      etag: string,
      id: {
        kind:string,
        videoId:string
      },
      snippet: {
        publishedAt: string,
        channelId: string,
        title: string,
        description:string
        thumbnails:{
            default:{
                url:string,
                width:number
                height:number
            },
            medium:{
                url:string,
                width:number
                height:number
            },
            small:{
                url:string,
                width:number
                height:number
            }
        },
        channelTitle: string,
        liveBroadcastContent: string,
        publishTime: string
      }
    }[],
  
}


