import React from 'react';
import { Link } from 'react-router-dom'; // Importação para o link de navegação
import { useData } from '../context/DataContext';

const TimeLogScreen = () => {
  const { timeLogs = [] } = useData();

  // Funções para formatar data e hora de forma legível
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
      {/* Botão para voltar à página principal */}
      <Link to="/" className="text-blue-400 hover:underline mb-6 inline-block">
        &larr; Voltar ao Dashboard
      </Link>

      <h2 className="text-3xl font-bold mb-4">Registo de Ponto</h2>

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="w-full text-left text-white">
          <thead className="bg-gray-700">
            <tr>
              <th className="p-3 font-semibold">Data</th>
              <th className="p-3 font-semibold">Entrada</th>
              <th className="p-3 font-semibold">Saída</th>
            </tr>
          </thead>
          <tbody>
            {timeLogs.length > 0 ? timeLogs.map(log => (
              <tr key={log.id} className="border-b border-gray-700 last:border-b-0">
                <td className="p-3">{formatDate(log.clock_in_time)}</td>
                <td className="p-3">{formatTime(log.clock_in_time)}</td>
                <td className="p-3">{formatTime(log.clock_out_time)}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="3" className="text-gray-500 p-4 text-center">Nenhum registo de ponto encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TimeLogScreen;

