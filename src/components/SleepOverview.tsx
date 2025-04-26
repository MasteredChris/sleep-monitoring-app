// src/components/SleepOverview.tsx

import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { calculateSleepQuality } from '../utils/calculateSleepQuality';
import TrendPerYear from './TrendPerYear';
import SleepDetail from './SleepDetail';
import DetailedTrendChart from './DetailedTrendChart';

export interface AggregatedSleepData {
  id: number;
  date: string;      // "YYYY-MM-DD"
  duration: number;  // in ore
  deepSleep: number; // in ore
  remSleep: number;  // in ore
  awakeTime: number; // in ore
  lightSleep: number;// in ore
  quality: number;   // % qualità
}

const SleepOverview: React.FC = () => {
  const [aggregatedData, setAggregatedData] = useState<AggregatedSleepData[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');

  useEffect(() => {
    fetch('/src/data/4-sleep_data_2025-02-11.csv')
      .then(res => res.text())
      .then(csvText => {
        Papa.parse<string[]>(csvText, {
          delimiter: ',',
          header: false,
          dynamicTyping: true,
          complete: ({ data: raw }) => {
            // parse lines: [ "YYYY-MM-DD hh:mm:ss", " stage" ]
            const records = raw
              .filter(r => r.length >= 2 && r[0])
              .map(r => ({
                timestamp: (r[0] as string).trim(),
                stage:    (r[1] as string).trim().toLowerCase(),
              }))
              // sort by timestamp
              .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

            // group by day
            const groups: Record<string, typeof records> = {};
            records.forEach(r => {
              const day = r.timestamp.split(' ')[0];
              if (!groups[day]) groups[day] = [];
              groups[day].push(r);
            });

            // aggregate per day
            const agg: AggregatedSleepData[] = [];
            let id = 1;
            Object.entries(groups).forEach(([day, recs]) => {
              if (recs.length < 2) return;
              const t0 = new Date(recs[0].timestamp);
              const tN = new Date(recs[recs.length - 1].timestamp);
              const totalDuration = (tN.getTime() - t0.getTime()) / (1000 * 60 * 60);

              let deep = 0, rem = 0, awake = 0;
              for (let i = 0; i < recs.length - 1; i++) {
                const curr = new Date(recs[i].timestamp);
                const next = new Date(recs[i + 1].timestamp);
                const diffH = (next.getTime() - curr.getTime()) / (1000 * 60 * 60);
                switch (recs[i].stage) {
                  case 'deep': deep   += diffH; break;
                  case 'rem':  rem    += diffH; break;
                  case 'awake':awake += diffH; break;
                  // 'light' is derived below
                }
              }

              const light = totalDuration - (deep + rem + awake);
              const quality = calculateSleepQuality({
                duration: totalDuration,
                deepSleep: deep,
                remSleep:  rem,
                awakeTime: awake,
              });

              agg.push({
                id:         id++,
                date:       day,
                duration:   parseFloat(totalDuration.toFixed(2)),
                deepSleep:  parseFloat(deep.toFixed(2)),
                remSleep:   parseFloat(rem.toFixed(2)),
                awakeTime:  parseFloat(awake.toFixed(2)),
                lightSleep: parseFloat(light.toFixed(2)),
                quality,
              });
            });

            agg.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            setAggregatedData(agg);
            if (agg.length > 0) {
              setSelectedDate(agg[agg.length - 1].date);
            }
          }
        });
      })
      .catch(err => console.error('Errore caricamento CSV:', err));
  }, []);

  // selected record & navigation
  const selectedRecord = aggregatedData.find(r => r.date === selectedDate);
  const idx = aggregatedData.findIndex(r => r.date === selectedDate);
  const hasPrev = idx > 0;
  const hasNext = idx < aggregatedData.length - 1;

  const goPrev = () => { if (hasPrev) setSelectedDate(aggregatedData[idx - 1].date); };
  const goNext = () => { if (hasNext) setSelectedDate(aggregatedData[idx + 1].date); };

  return (
    <div className="sleep-overview">
      <h2>Seleziona una data</h2>
      <input
        type="date"
        value={selectedDate}
        onChange={e => setSelectedDate(e.target.value)}
        min={aggregatedData[0]?.date}
        max={aggregatedData[aggregatedData.length - 1]?.date}
      />
      <div style={{ margin: '10px 0' }}>
        <button onClick={goPrev} disabled={!hasPrev}>Precedente</button>
        <button onClick={goNext} disabled={!hasNext} style={{ marginLeft: 8 }}>Successivo</button>
      </div>

      {selectedRecord ? (
        <SleepDetail record={selectedRecord} />
      ) : (
        <div className="sleep-detail"><p>Dati non disponibili per quella data</p></div>
      )}

      {/* Andamento giorno per giorno */}
      <DetailedTrendChart data={aggregatedData} />

      {/* Trend settimanale/mensile su anno */}
      <TrendPerYear data={aggregatedData} />
    </div>
  );
};

export default SleepOverview;
