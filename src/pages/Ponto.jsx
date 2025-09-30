import React from 'react';
import { useData } from '../context/DataContext';

const TimeLogScreen = () => {
  const { timeLogs } = useData();

  const formatDate = (dateString) => {
    if (!dateString) return '---';
    return new Date(dateString).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };
  
  const formatTime = (dateString) => {
    if (!dateString) return 'Em andamento';
    return new Date(dateString).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Registro de Ponto</h2>
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-3">Data</th>
              <th className="p-3">Entrada</th>
              <th className="p-3">Saída</th>
            </tr>
          </thead>
          <tbody>
            {timeLogs.map(log => (
              <tr key={log.id} className="border-b border-gray-700 last:border-b-0">
                <td className="p-3">{formatDate(log.clock_in_time)}</td>
                <td className="p-3">{formatTime(log.clock_in_time)}</td>
                <td className="p-3">{formatTime(log.clock_out_time)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {timeLogs.length === 0 && <p className="text-gray-500 p-4 text-center">Nenhum registro de ponto encontrado.</p>}
      </div>
    </div>
  );
};

export default TimeLogScreen;
