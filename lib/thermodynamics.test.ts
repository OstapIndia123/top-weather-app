import { describe, expect, it } from "vitest";
import { calculateThermodynamics, CONSTANTS } from "./thermodynamics";
describe("calculateThermodynamics", () => {
  it("returns the dry reference state", () => { const x=calculateThermodynamics({T_C:0,RH:0,p_hPa:1000}); expect(x.theta).toBeCloseTo(CONSTANTS.T0,8); expect(x.thetaE).toBeCloseTo(CONSTANTS.T0,8); expect(x.entropyIndex).toBeCloseTo(0,8); expect(x.mixingRatio).toBe(0); });
  it("matches a warm humid worked example", () => { const x=calculateThermodynamics({T_C:25,RH:84,p_hPa:1010}); expect(x.saturationVaporPressure).toBeCloseTo(31.67,1); expect(x.mixingRatioGkg).toBeCloseTo(16.85,1); expect(x.theta).toBeCloseTo(297.30,1); expect(x.thetaE).toBeCloseTo(342.5,0); expect(x.entropyIndex).toBeCloseTo(227,0); });
  it("increases with humidity", () => { const dry=calculateThermodynamics({T_C:25,RH:30,p_hPa:1000}); const humid=calculateThermodynamics({T_C:25,RH:90,p_hPa:1000}); expect(humid.entropyIndex).toBeGreaterThan(dry.entropyIndex); });
  it("validates physical input", () => { expect(()=>calculateThermodynamics({T_C:20,RH:101,p_hPa:1000})).toThrow(); expect(()=>calculateThermodynamics({T_C:20,RH:50,p_hPa:0})).toThrow(); });
});
