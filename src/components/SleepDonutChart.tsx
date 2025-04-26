import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
//import './Donut.css';
interface SleepRecord {
  duration: number;
  deepSleep: number;
  remSleep: number;
  awakeTime: number;
  lightSleep:number;
}

interface SleepDonutChartProps {
  record: SleepRecord;
}

const COLORS = ['#33BBFF', '#35FF51', '#FF338A', '#FFB233'];

const SleepDonutChart: React.FC<SleepDonutChartProps> = ({ record }) => {
  const { duration, deepSleep, remSleep, awakeTime, lightSleep } = record;
  //const lightSleep = parseFloat((duration - (deepSleep + remSleep + awakeTime)).toFixed(2));

  const data = [
    { name: 'Sonno Profondo', value: deepSleep },
    { name: 'REM', value: remSleep },
    { name: 'Risvegli', value: awakeTime },
    { name: 'Sonno Leggero', value: lightSleep },
  ];

  // Funzione per formattare il tempo in "h min"
  const formatTimeLabel = (value: number) => {
    const hours = Math.floor(value);
    const minutes = Math.round((value - hours) * 60);
    return `${hours}h ${minutes}min`;
  };

  return (
    <div style={{width:'100%',height:"100%", paddingTop:10}}>
      <h3>Distribuzione Fasi del Sonno</h3>
      <ResponsiveContainer height={400}>
        <PieChart >
          <Pie
            cx="50%"
            cy="56%"
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius="60%"
            outerRadius="90%"
            label={({ value }) => formatTimeLabel(value)}
            
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => formatTimeLabel(value)} />
          <Legend 
            verticalAlign="bottom" 
            align="center" 
            layout="horizontal" 
            wrapperStyle={{paddingTop:50 }} 
          />
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            fontSize={20}
          >
            Tot: {formatTimeLabel(duration)}
          </text>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SleepDonutChart;
