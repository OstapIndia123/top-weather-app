import { COMFORT_SCALE, getComfortBand } from "@/lib/comfortScale";

export function EntropyGauge({ value }: { value: number }) {
  const band = getComfortBand(value);
  const position = Math.max(2, Math.min(98, ((value + 10) / 270) * 100));
  return <div className="gauge" aria-label={`Шкала индекса: ${band.label}`}>
    <div className="gauge-labels"><span>сухо</span><span>комфорт</span><span>душно</span></div>
    <div className="gauge-track">{COMFORT_SCALE.map((item, index) => <i key={item.label} style={{ background:item.color, flex:index === 4 ? 50 : item.max - (index ? COMFORT_SCALE[index - 1].max : 0) }} />)}</div>
    <div className="gauge-marker" style={{ left:`${position}%`, borderColor:band.color }} />
  </div>;
}
