export interface SleepData {
  id: number;
  date: string;
  duration: number; // in ore
  deepSleep: number; // in ore
  remSleep: number; // in ore
  awakeTime: number; // in ore
  lightSleep:number;
}

// Genera 50 giorni di dati di test
const generateTestData = (): SleepData[] => {
  const testData: SleepData[] = [];
  const today = new Date();
  
  for (let i = 0; i < 500; i++) {
    const date = new Date();
    date.setDate(today.getDate() - (50 - i)); // Date progressiva fino a oggi

    const duration = Math.random() * (9 - 5) + 5; // Sonno tra 5 e 9 ore
    const deepSleep = duration * (Math.random() * (0.3 - 0.15) + 0.15); // 15-30% del sonno totale
    const remSleep = duration * (Math.random() * (0.25 - 0.1) + 0.1); // 10-25% del sonno totale
    const awakeTime = duration * (Math.random() * (0.1 - 0.02) + 0.02); // 2-10% del sonno totale
    const lightSleep = duration - (deepSleep +remSleep + awakeTime);

    testData.push({
      id: i + 1,
      date: date.toISOString().split('T')[0], // Formato YYYY-MM-DD
      duration: parseFloat(duration.toFixed(2)),
      deepSleep: parseFloat(deepSleep.toFixed(2)),
      remSleep: parseFloat(remSleep.toFixed(2)),
      awakeTime: parseFloat(awakeTime.toFixed(2)),
      lightSleep: parseFloat(lightSleep.toFixed(2)),
    });
  }
  /*testData.push({
    id: 0,
    date: '2026-02-01',
    duration: 2,
    deepSleep: 0,
    remSleep: 1,
    awakeTime: 0.5,
  })*/
  testData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Ordina per data crescente
  return testData;
};

// Genera e ordina i dati di test in ordine cronologico crescente
export const sleepData: SleepData[] = generateTestData();
