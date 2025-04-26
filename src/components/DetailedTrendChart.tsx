import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface SleepRecord {
  date: string; // "YYYY-MM-DD"
  quality: number;
}

type ViewMode = 'weekly' | 'monthly';

interface Props {
  data: SleepRecord[];
}

const DetailedTrendBarChart: React.FC<Props> = ({ data }) => {
  // 1. Ordiniamo i dati in ordine cronologico (UTC)
  const sortedData = [...data].sort(
    (a, b) => parseDateUTC(a.date).getTime() - parseDateUTC(b.date).getTime()
  );

  // 2. Ultima data disponibile
  const latestDateStr = sortedData[sortedData.length - 1]?.date;
  const latestDate = latestDateStr ? parseDateUTC(latestDateStr) : new Date();

  // 3. Stato per la vista (settimanale/mensile)
  const [viewMode, setViewMode] = useState<ViewMode>('weekly');

  // 4. Data di inizio periodo
  const [currentPeriodStart, setCurrentPeriodStart] = useState<Date>(() => {
    return getMondayUTC(latestDate); // se preferisci default "monthly", usa new Date(latestDate.getUTCFullYear(), latestDate.getUTCMonth(), 1);
  });

  // 5. useEffect: cambia la data di inizio solo quando viewMode cambia
  useEffect(() => {
    if (viewMode === 'weekly') {
      setCurrentPeriodStart(getMondayUTC(latestDate));
    } else {
      // primo giorno del mese in UTC
      setCurrentPeriodStart(new Date(Date.UTC(latestDate.getUTCFullYear(), latestDate.getUTCMonth(), 1)));
    }
  }, [viewMode]); // NO latestDate nelle dipendenze!

  // -- FUNZIONI HELPER --

  // parseDateUTC: trasforma "YYYY-MM-DD" in data UTC (senza offset locale)
  function parseDateUTC(str: string): Date {
    const [yyyy, mm, dd] = str.split('-').map(Number);
    // Creiamo la data a mezzanotte UTC
    return new Date(Date.UTC(yyyy, mm - 1, dd));
  }

  // getMondayUTC: restituisce il lunedì (UTC) della settimana di date
  function getMondayUTC(date: Date): Date {
    const d = new Date(date.getTime());
    const day = d.getUTCDay(); // 0=Dom, 1=Lun, ...
    const diff = d.getUTCDate() - (day === 0 ? 6 : day - 1);
    d.setUTCDate(diff);
    // Ora d è lunedì (UTC) della stessa settimana
    return d;
  }

  // 6. Calcoliamo la data di fine periodo
  let periodEnd: Date;
  if (viewMode === 'weekly') {
    periodEnd = new Date(currentPeriodStart.getTime());
    periodEnd.setUTCDate(periodEnd.getUTCDate() + 6); // Lunedì + 6 = Domenica
  } else {
    // Ultimo giorno del mese (UTC)
    periodEnd = new Date(currentPeriodStart.getTime());
    periodEnd.setUTCMonth(periodEnd.getUTCMonth() + 1, 0);
  }

  // 7. Filtriamo i dati del periodo [currentPeriodStart, periodEnd]
  const periodData = sortedData.filter(record => {
    const recDate = parseDateUTC(record.date);
    return recDate.getTime() >= currentPeriodStart.getTime() && recDate.getTime() <= periodEnd.getTime();
  });

  // 8. Formatter per l'asse X
  const xAxisFormatter = (dateStr: string) => {
    const date = parseDateUTC(dateStr);
    if (viewMode === 'weekly') {
      // 0=Sun, 1=Mon, ...
      // Puoi fare un array di short day name o usare toLocaleString in UTC
      const dayNames = ['Domenica','Lunedì','Martedì','Mercoledì','Giovedì','Venerdì','Sabato'];
      return dayNames[date.getUTCDay()];
    } else {
      // Ritorna il numero del giorno del mese in UTC
      return date.getUTCDate().toString();
    }
  };

  // 9. Navigazione: periodo precedente
  const goToPreviousPeriod = () => {
    if (viewMode === 'weekly') {
      const prev = new Date(currentPeriodStart.getTime());
      prev.setUTCDate(prev.getUTCDate() - 7);
      setCurrentPeriodStart(getMondayUTC(prev));
    } else {
      const prev = new Date(currentPeriodStart.getTime());
      // Mese precedente, giorno 1
      prev.setUTCMonth(prev.getUTCMonth() - 1, 1);
      setCurrentPeriodStart(prev);
    }
  };

  // 10. Navigazione: periodo successivo
  const goToNextPeriod = () => {
    if (viewMode === 'weekly') {
      const next = new Date(currentPeriodStart.getTime());
      next.setUTCDate(next.getUTCDate() + 7);
      setCurrentPeriodStart(getMondayUTC(next));
    } else {
      const next = new Date(currentPeriodStart.getTime());
      // Mese successivo, giorno 1
      next.setUTCMonth(next.getUTCMonth() + 1, 1);
      setCurrentPeriodStart(next);
    }
  };

  function formatMonthUTC(date: Date): string {
    return date.toLocaleString('it-IT', {
      timeZone: 'UTC',
      month: 'long',
      year: 'numeric'
    });
  }

  function formatDateUTC(date: Date): string {
    return date.toLocaleString('it-IT', {
      timeZone: 'UTC',   // Forza l'uso del UTC
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  // 11. Testo del periodo
  const displayPeriod = () => {
    if (viewMode === 'weekly') {
        // Esempio: "15 Dec 2025 - 21 Dec 2025"
        return `${formatDateUTC(currentPeriodStart)} - ${formatDateUTC(periodEnd)}`;
      } else {
        // Esempio: "May 2025"
        return formatMonthUTC(currentPeriodStart);
      }
    };

  return (
    <div>
      <h2>Andamento</h2>
      <div style={{ marginBottom: '10px' }}>
        <label>
          Visualizza per:{' '}
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value as ViewMode)}
          >
            <option value="weekly">Settimana</option>
            <option value="monthly">Mese</option>
          </select>
        </label>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
        <button onClick={goToPreviousPeriod}>Precedente</button>
        <span style={{ margin: '0 15px' }}>{displayPeriod()}</span>
        <button onClick={goToNextPeriod}>Successivo</button>
      </div>

      {periodData.length === 0 && (
        <p style={{ textAlign: 'center', color: 'red' }}>
          Nessun dato per questo periodo
        </p>
      )}

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={periodData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={xAxisFormatter} />
          <YAxis domain={[0, 100]} />
          <Tooltip
                /* labelFormatter converte la stringa (es. "2025-01-15") in un oggetto Date UTC e poi la formatta in stile "15 Dec 2025" */
                labelFormatter={(label: string) => {
                    const date = parseDateUTC(label); // la tua funzione che parse "YYYY-MM-DD" come UTC
                    return formatDateUTC(date);       // la tua funzione che formatta in "DD MMM YYYY"
                }}
                /* formatter converte il valore numerico in una stringa con % */
                formatter={(value: number) => `${value.toFixed(2)}%`}
            />

          <Legend />
          <Bar dataKey="quality" fill="purple" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DetailedTrendBarChart;
