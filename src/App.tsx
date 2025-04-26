import React from 'react';
import SleepOverview from './components/SleepOverview';
import './index.css';

const App: React.FC = () => {
  return (
    <div>
      <h1>Monitoraggio del Sonno</h1>
      <SleepOverview />
    </div>
  );
};

export default App;
