export const COMFORT_SCALE = [
  { max: 60, label: "Прохладно / сухо", short: "Сухо", color: "#74b9ff", description: "Прохладная или сухая воздушная масса." },
  { max: 110, label: "Комфортно", short: "Комфортно", color: "#78f0bd", description: "Мягкое сочетание тепла и влажности." },
  { max: 160, label: "Влажновато или тепло", short: "Влажновато", color: "#f3db78", description: "Тепло или повышенная влажность уже заметны." },
  { max: 220, label: "Душно", short: "Душно", color: "#ff9a62", description: "Воздух тёплый и влажный, испарение пота затруднено." },
  { max: Infinity, label: "Очень душно / тропический воздух", short: "Очень душно", color: "#ff6b78", description: "Очень большой запас тепла и водяного пара." },
] as const;
export type ComfortBand = (typeof COMFORT_SCALE)[number];
export const getComfortBand = (value: number): ComfortBand => COMFORT_SCALE.find((band) => value < band.max) ?? COMFORT_SCALE[4];
