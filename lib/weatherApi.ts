export interface Place { name: string; country?: string; latitude: number; longitude: number }
export interface WeatherData { temperature: number | null; humidity: number | null; dewPoint: number | null; apparentTemperature: number | null; surfacePressure: number | null; pressureMsl: number | null; weatherCode: number | null; windSpeed: number | null; precipitation: number | null; time: string }

export async function getWeather(latitude: number, longitude: number, signal?: AbortSignal): Promise<WeatherData> {
  const params = new URLSearchParams({ latitude:String(latitude), longitude:String(longitude), current:"temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,surface_pressure,pressure_msl,weather_code,wind_speed_10m,precipitation", timezone:"auto" });
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, { signal });
  if (!response.ok) throw new Error("Сервис погоды временно недоступен");
  const { current } = await response.json();
  if (!current) throw new Error("В ответе сервиса нет текущей погоды");
  const value = (key: string): number | null => Number.isFinite(current[key]) ? current[key] : null;
  return { temperature:value("temperature_2m"), humidity:value("relative_humidity_2m"), dewPoint:value("dew_point_2m"), apparentTemperature:value("apparent_temperature"), surfacePressure:value("surface_pressure"), pressureMsl:value("pressure_msl"), weatherCode:value("weather_code"), windSpeed:value("wind_speed_10m"), precipitation:value("precipitation"), time:current.time };
}

export async function searchPlaces(query: string, signal?: AbortSignal): Promise<Place[]> {
  const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=ru&format=json`, { signal });
  if (!response.ok) throw new Error("Не удалось выполнить поиск");
  const data = await response.json();
  return (data.results ?? []).map((p: Place) => ({ name:p.name, country:p.country, latitude:p.latitude, longitude:p.longitude }));
}
