"use client";
import { useMemo, useState } from "react";
import { calculateThermodynamics } from "@/lib/thermodynamics";
import { getComfortBand } from "@/lib/comfortScale";
export function Calculator() {
  const [t,setT]=useState(25), [rh,setRh]=useState(60), [p,setP]=useState(1000);
  const result=useMemo(() => { try { return calculateThermodynamics({T_C:t,RH:rh,p_hPa:p}); } catch { return null; } },[t,rh,p]);
  return <section className="calculator"><div><p className="eyebrow">ЛАБОРАТОРИЯ</p><h2>Проверьте свою погоду</h2><p>Измените параметры и посмотрите, как водяной пар меняет состояние воздуха.</p></div><div className="calc-inputs">{[["Температура, °C",t,setT],["Влажность, %",rh,setRh],["Давление, hPa",p,setP]].map(([label,value,setter])=><label key={label as string}><span>{label as string}</span><input type="number" value={value as number} onChange={e => (setter as (x:number)=>void)(Number(e.target.value))}/></label>)}</div><div className="calc-result"><span>ИНДЕКС</span><strong style={{color:result ? getComfortBand(result.entropyIndex).color : undefined}}>{result ? `${result.entropyIndex.toFixed(0)}` : "—"}</strong><small>Дж/(кг·К)</small></div></section>;
}
