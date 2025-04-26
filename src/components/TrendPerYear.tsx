import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface SleepRecord {
  date: string;
  quality: number;
}

interface TrendChartsProps {
  data: SleepRecord[];
}

// Funzione per ottenere il lunedì della settimana della data fornita
const getMonday = (date: Date): string => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff)).toISOString().slice(0, 10);
};

const formatDateTick = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('it-IT', {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  }).toLowerCase();
};

const formatMonthTick = (monthStr: string): string => {
  const date = new Date(monthStr + "-01");
  return date.toLocaleDateString('it-IT', {
    month: 'short',
    year: 'numeric'
  }).toLowerCase();
};

const TrendCharts: React.FC<TrendChartsProps> = ({ data }) => {
  if (data.length === 0) return null;

  // Estrae gli anni disponibili
  const availableYears = Array.from(new Set(data.map(record => new Date(record.date).getFullYear()))).sort((a, b) => a - b);
  const [selectedYear, setSelectedYear] = useState<number>(availableYears[availableYears.length - 1]);

  // Filtra i dati per l'anno selezionato
  const filteredData = data.filter(record => new Date(record.date).getFullYear() === selectedYear);

  // Aggregazione settimanale
  const weeklyMap: { [week: string]: { sum: number; count: number } } = {};
  filteredData.forEach(record => {
    const weekKey = getMonday(new Date(record.date));
    if (!weeklyMap[weekKey]) {
      weeklyMap[weekKey] = { sum: 0, count: 0 };
    }
    weeklyMap[weekKey].sum += record.quality;
    weeklyMap[weekKey].count += 1;
  });
  const weeklyData = Object.keys(weeklyMap).map(weekKey => ({
    week: weekKey,
    quality: weeklyMap[weekKey].sum / weeklyMap[weekKey].count,
  }));
  weeklyData.sort((a, b) => new Date(a.week).getTime() - new Date(b.week).getTime());

  // Aggregazione mensile
  const monthlyMap: { [month: string]: { sum: number; count: number } } = {};
  filteredData.forEach(record => {
    const monthKey = record.date.slice(0, 7); // "YYYY-MM"
    if (!monthlyMap[monthKey]) {
      monthlyMap[monthKey] = { sum: 0, count: 0 };
    }
    monthlyMap[monthKey].sum += record.quality;
    monthlyMap[monthKey].count += 1;
  });
  const monthlyData = Object.keys(monthlyMap).map(monthKey => ({
    month: monthKey,
    quality: monthlyMap[monthKey].sum / monthlyMap[monthKey].count,
  }));
  monthlyData.sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

  // Stato per selezionare il tipo di trend da visualizzare
  const [trendType, setTrendType] = useState<'daily'|'weekly'|'monthly'>('daily');

  return (
    <div className="trend-charts">
      <h2>Trend per anno - {selectedYear}</h2>
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor="year-trend">Seleziona anno: </label>
        <select
          id="year-trend"
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        >
          {availableYears.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      <select
        value={trendType}
        onChange={(e) => setTrendType(e.target.value as 'weekly' | 'monthly')}
        style={{ marginBottom: '20px' }}
      >
        <option value="daily">Giornaliero</option>
        <option value="weekly">Settimanale</option>
        <option value="monthly">Mensile</option>
        
      </select>

      {trendType === 'daily' && (
        <div>
          <h3>Trend Giornaliero ({selectedYear})</h3>
          <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={filteredData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    {/* Nascondiamo l'asse X perché le date saranno visibili nel tooltip */}
                    <XAxis dataKey="date" hide />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value: number) => value.toFixed(2)} labelFormatter={formatDateTick} />
                    <Legend />
                    {/* Linea continua e curva */}
                    <Line type="step" dataKey="quality" stroke="purple" activeDot={{ r: 4 }} dot={{ r: 0 }} />
                  </LineChart>
                </ResponsiveContainer>
        </div>
      )}

      {trendType === 'weekly' && (
        <div>
          <h3>Trend Settimanale ({selectedYear})</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" hide />
              <YAxis domain={[0, 100]} />
              <Tooltip labelFormatter={formatDateTick} formatter={(value: number) => `${value.toFixed(2)}%`}  />
              <Legend />
              <Line type="monotone" dataKey="quality" stroke="green" activeDot={{ r: 4}} dot={{ r: 0 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {trendType === 'monthly' && (
        <div>
          <h3>Trend Mensile ({selectedYear})</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" hide />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(value: number) => value.toFixed(2)} labelFormatter={formatMonthTick} />
              <Legend />
              <Line type="monotone" dataKey="quality" stroke="red" activeDot={{ r: 4}} dot={{ r: 0 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default TrendCharts;
