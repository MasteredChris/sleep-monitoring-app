import { SleepData } from '../data/sleepData';

export const calculateSleepQuality = (data: SleepData): number => {
  const idealSleep = 8; // ore ideali
  const pDurata = (data.duration / idealSleep) * 100;
  const pFase = ((data.deepSleep + data.remSleep) / data.duration) * 100;
  const pRisvegli = (data.awakeTime / data.duration) * 100;
  const pFinale = (pDurata * 0.5) + (pFase * 0.5) - pRisvegli;
  return pFinale;
};
