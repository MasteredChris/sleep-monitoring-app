export interface SleepParams {
    duration: number;
    deepSleep: number;
    remSleep: number;
    awakeTime: number;
  }
  
  export function calculateSleepQuality(params: SleepParams): number {
    const { duration, deepSleep, remSleep, awakeTime } = params;
    const IDEAL_SLEEP = 8;
    const P_durata = (duration / IDEAL_SLEEP) * 100;
    const P_fase = ((deepSleep + remSleep) / duration) * 100;
    const P_risvegli = (awakeTime / duration) * 100;
    const quality = (P_durata * 0.5) + (P_fase * 0.5) - P_risvegli;
    return parseFloat(quality.toFixed(2));
  }
  