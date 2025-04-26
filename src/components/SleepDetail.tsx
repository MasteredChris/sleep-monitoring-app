import React from 'react';
import SleepDonutChart from './SleepDonutChart';

interface SleepRecord {
  id: number;
  date: string;
  duration: number;
  deepSleep: number;
  remSleep: number;
  awakeTime: number;
  quality: number;
  lightSleep:number;
}

interface SleepDetailProps {
  record: SleepRecord;
}

const SleepDetail: React.FC<SleepDetailProps> = ({ record }) => {
  // Funzione helper per formattare il tempo in ore e minuti
  const formatTime = (time: number): string => {
    const hours = Math.floor(time);
    const minutes = Math.round((time - hours) * 60);
    return `${hours}h ${minutes}min`;
  };

  // Calcola il sonno leggero
  //const lightSleep = record.duration - (record.deepSleep + record.remSleep + record.awakeTime);

  // Formattazione della data per mostrare il "momento" della dormita
  const formattedDate = new Date(record.date).toLocaleDateString('it-IT', {
    weekday: 'long',
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  });

  // Determina il consiglio in base al punteggio di qualità
  let advice = '';
  if (record.quality >= 80) {
    advice = '✅ Ottimo lavoro! Mantieni queste abitudini';
  } else if (record.quality >= 60) {
    advice = '📈Qualità del sonno buona ma migliorabile.';
  } else if (record.quality >= 40) {
    advice = "📱 Riduci l'uso di dispositivi 1-2 ore prima di dormire\n🌡️ Mantieni una temperatura ambiente di 18-20°C\n☕ Evita caffeina dopo le 16:00";
  } else {
    advice = "⚠️Considera una consulenza specialistica\n 👨‍⚕️ Migliora l'ambiente di sonno (rumore/luce/temperatura)";
  }

  return (
    <div className="sleep-detail">
      <h3>{formattedDate}</h3>
      <ul>
        <li><strong>Durata:</strong> {formatTime(record.duration)}</li>
        <li><strong>Sonno Profondo:</strong> {formatTime(record.deepSleep)}</li>
        <li><strong>REM:</strong> {formatTime(record.remSleep)}</li>
        <li><strong>Risvegli:</strong> {formatTime(record.awakeTime)}</li>
        <li><strong>Sonno Leggero:</strong> {formatTime(record.lightSleep)}</li>
        <li><strong>Qualità:</strong> {record.quality.toFixed(2)}%</li>
      </ul>
      <p><strong>Consiglio:</strong> {advice}</p>
      <SleepDonutChart record={record} />
    </div>
  );
};

export default SleepDetail;
