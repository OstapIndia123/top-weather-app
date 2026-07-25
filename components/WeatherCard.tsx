import { WeatherData } from "@/lib/weatherApi";
import { ThermodynamicResult } from "@/lib/thermodynamics";
import { describeWeatherCode } from "@/lib/weatherCode";
import { getComfortBand } from "@/lib/comfortScale";
import { EntropyGauge } from "./EntropyGauge";

const n = (value: number | null, digits = 0) => value == null ? "—" : value.toFixed(digits);
export function WeatherCard({ place, weather, physics, kelvin, pressureFallback }: { place:string; weather:WeatherData; physics:ThermodynamicResult | null; kelvin:boolean; pressureFallback:boolean }) {
  const band = physics ? getComfortBand(physics.entropyIndex) : null;
  const potential = (v: number) => kelvin ? `${v.toFixed(1)} K` : `${(v - 273.15).toFixed(1)} °C`;
  return <article className="weather-card">
    <header className="card-head"><div><div className="eyebrow">СЕЙЧАС · {weather.weatherCode == null ? "ПОГОДА" : describeWeatherCode(weather.weatherCode).toUpperCase()}</div><h1>{place}</h1></div><div className="weather-symbol" aria-hidden="true">◒</div></header>
    <div className="hero-values"><div><span>Температура</span><strong>{n(weather.temperature, 1)}°</strong><small>Ощущается как {n(weather.apparentTemperature, 1)}°</small></div><div className="entropy"><span>MOIST ENTROPY INDEX</span><strong style={{ color:band?.color }}>{physics ? `${physics.entropyIndex >= 0 ? "+" : ""}${physics.entropyIndex.toFixed(0)}` : "—"}</strong><small>Дж / (кг сухого воздуха · К)</small></div></div>
    {physics && <EntropyGauge value={physics.entropyIndex} />}
    {band && <div className="assessment" style={{ borderColor:band.color }}><span style={{ color:band.color }}>ОЦЕНКА</span><div><b>{band.short}.</b> {band.description}</div></div>}
    {!physics && <div className="error">Индекс не рассчитан: отсутствуют температура, влажность или давление.</div>}
    {pressureFallback && <div className="warning">Используется давление на уровне моря: расчёт менее точный.</div>}
    <div className="metrics">
      <div><span>Влажность</span><b>{n(weather.humidity)}%</b></div><div><span>Точка росы</span><b>{n(weather.dewPoint, 1)} °C</b></div><div><span>Давление</span><b>{n(weather.surfacePressure ?? weather.pressureMsl)} hPa</b></div><div><span>Ветер</span><b>{n(weather.windSpeed, 1)} км/ч</b></div>
    </div>
    {physics && <div className="science-row"><div><span>MIXING RATIO</span><b>{physics.mixingRatioGkg.toFixed(1)} <small>г/кг</small></b></div><div><span>ПОТЕНЦ. ТЕМП. θ</span><b>{potential(physics.theta)}</b></div><div><span>ЭКВИВ. ТЕМП. θₑ</span><b>{potential(physics.thetaE)}</b></div></div>}
  </article>;
}
