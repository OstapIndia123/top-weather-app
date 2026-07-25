"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Calculator } from "@/components/Calculator";
import { LocationSearch } from "@/components/LocationSearch";
import { WeatherCard } from "@/components/WeatherCard";
import { calculateThermodynamics } from "@/lib/thermodynamics";
import { getWeather, Place, WeatherData } from "@/lib/weatherApi";

const DEFAULT: Place = { name:"Ивано-Франковск", country:"Украина", latitude:48.9226, longitude:24.7111 };
export default function Home() {
  const [place,setPlace]=useState(DEFAULT), [weather,setWeather]=useState<WeatherData|null>(null), [loading,setLoading]=useState(true), [error,setError]=useState(""), [updated,setUpdated]=useState<Date|null>(null), [kelvin,setKelvin]=useState(true), [geoState,setGeoState]=useState("Запрашиваем геопозицию…");
  const load=useCallback(async (target:Place) => { setLoading(true); setError(""); try { setWeather(await getWeather(target.latitude,target.longitude)); setPlace(target); setUpdated(new Date()); } catch(e) { setError((e as Error).message || "Не удалось загрузить погоду"); } finally { setLoading(false); } },[]);
  useEffect(() => { if (!navigator.geolocation) { setGeoState("Геолокация не поддерживается — выберите город"); load(DEFAULT); return; } navigator.geolocation.getCurrentPosition(pos => { setGeoState("Точная геопозиция · координаты не сохраняются"); load({name:"Ваше местоположение",latitude:pos.coords.latitude,longitude:pos.coords.longitude}); }, () => { setGeoState("Доступ к геопозиции не предоставлен — выберите город"); load(DEFAULT); }, {enableHighAccuracy:true,timeout:9000,maximumAge:300000}); },[load]);
  const pressure=weather?.surfacePressure ?? weather?.pressureMsl ?? null;
  const physics=useMemo(() => { if (weather?.temperature == null || weather.humidity == null || pressure == null) return null; try { return calculateThermodynamics({T_C:weather.temperature,RH:weather.humidity,p_hPa:pressure}); } catch { return null; } },[weather,pressure]);
  return <main>
    <nav><a className="brand" href="#"><i>◉</i><span>MOIST ENTROPY<br/><b>WEATHER</b></span></a><div className="nav-actions"><LocationSearch onSelect={load}/><button className="unit" onClick={()=>setKelvin(!kelvin)}>θ: {kelvin?"K":"°C"}</button></div></nav>
    <section className="location-note"><span>⌖</span><div><b>{geoState}</b><small>Координаты используются только в браузере для запроса погоды.</small></div></section>
    <div className="content">
      {error && <div className="error banner">{error}<button onClick={()=>load(place)}>Повторить</button></div>}
      {loading && !weather ? <div className="skeleton">Получаем атмосферные данные…</div> : weather && <WeatherCard place={place.country ? `${place.name}, ${place.country}` : place.name} weather={weather} physics={physics} kelvin={kelvin} pressureFallback={weather.surfacePressure == null && weather.pressureMsl != null}/>} 
      <div className="update-row"><span>{updated ? `Обновлено ${updated.toLocaleTimeString("ru",{hour:"2-digit",minute:"2-digit"})}` : ""}</span><button disabled={loading} onClick={()=>load(place)}>↻ {loading?"Обновляем…":"Обновить данные"}</button></div>
      <section className="comparison"><div><p className="eyebrow">ПОЧЕМУ ЭТО ВАЖНО</p><h2>Одинаковые 25 °C.<br/>Совсем разный воздух.</h2></div><div className="compare-cards">{[30,90].map(rh=>{const x=calculateThermodynamics({T_C:25,RH:rh,p_hPa:1000});return <div key={rh}><span>25 °C · {rh}% RH</span><b>{x.entropyIndex.toFixed(0)}</b><small>Дж/(кг·К) · {rh===30?"сухой воздух":"влажный воздух"}</small></div>})}</div></section>
      <Calculator/>
      <details><summary>Что означает индекс? <span>＋</span></summary><div className="details-content"><p>Температура показывает обычную теплоту воздуха, а влажность — насыщенность водяным паром. Moist Entropy Index объединяет температуру, давление и водяной пар в один термодинамический показатель.</p><p>Высокое значение обычно соответствует духоте, влажному теплу и большому запасу скрытой теплоты. Это <b>не медицинский heat index</b> и не абсолютная энтропия, а относительный индекс воздушной массы относительно условного эталона: 0 °C, 1000 hPa и сухой воздух.</p></div></details>
    </div><footer><span>Данные: Open-Meteo</span><span>Физика атмосферы, понятная каждому</span></footer>
  </main>;
}
