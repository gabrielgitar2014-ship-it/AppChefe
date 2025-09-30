import React from 'react';
import MainLayout from './components/MainLayout';
import { DataProvider } from './context/DataContext';

function App() {
  return (
    <DataProvider>
      <MainLayout />
    </DataProvider>
  );
}

export default App;
