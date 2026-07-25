/** A relative moist-air entropy index; it is not absolute entropy. */
export interface ThermodynamicInput { T_C: number; RH: number; p_hPa: number }
export interface ThermodynamicResult { temperatureK: number; saturationVaporPressure: number; vaporPressure: number; dryAirPressure: number; mixingRatio: number; mixingRatioGkg: number; theta: number; thetaE: number; entropyIndex: number }

export const CONSTANTS = { T0: 273.15, p0: 1000, cpd: 1004, Rd: 287, Lv: 2.5e6, epsilon: 0.622 } as const;

export function calculateThermodynamics({ T_C, RH, p_hPa }: ThermodynamicInput): ThermodynamicResult {
  if (![T_C, RH, p_hPa].every(Number.isFinite)) throw new Error("Все входные значения должны быть числами");
  if (RH < 0 || RH > 100) throw new Error("Влажность должна быть от 0 до 100%");
  if (p_hPa <= 0) throw new Error("Давление должно быть положительным");
  const temperatureK = T_C + CONSTANTS.T0;
  if (temperatureK <= 0) throw new Error("Температура должна быть выше абсолютного нуля");
  // Magnus saturation vapour pressure over liquid water (hPa).
  const saturationVaporPressure = 6.112 * Math.exp((17.67 * T_C) / (T_C + 243.5));
  const vaporPressure = (RH / 100) * saturationVaporPressure;
  const dryAirPressure = p_hPa - vaporPressure;
  if (dryAirPressure <= 0) throw new Error("Парциальное давление превышает общее давление");
  const mixingRatio = CONSTANTS.epsilon * vaporPressure / dryAirPressure;
  const kappa = CONSTANTS.Rd / CONSTANTS.cpd;
  const theta = temperatureK * Math.pow(CONSTANTS.p0 / p_hPa, kappa);
  // Simplified equivalent potential temperature using the mixing ratio.
  const thetaE = theta * Math.exp((CONSTANTS.Lv * mixingRatio) / (CONSTANTS.cpd * temperatureK));
  const entropyIndex = CONSTANTS.cpd * Math.log(thetaE / CONSTANTS.T0);
  return { temperatureK, saturationVaporPressure, vaporPressure, dryAirPressure, mixingRatio, mixingRatioGkg: mixingRatio * 1000, theta, thetaE, entropyIndex };
}
