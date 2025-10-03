// src/pages/DashboardPage.jsx

import React from 'react';
import { useData } from '../context/DataContext';
import { CheckCircle, Timer } from 'lucide-react';

// Um componente reutilizável para nossos cards de estatísticas
const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-gray-800 p-6 rounded-lg flex items-center space-x-4">
    <div className={`p-3 rounded-full ${color}`}>
      <Icon size={28} className="text-white" />
    </div>
    <div>
      <p className="text-gray-400 text-sm font-medium">{title}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  </div>
);

const DashboardPage = () => {
  // Vamos buscar os dados do nosso contexto mais tarde
  const { completedTasksCount, timeLogsCount } = useData();

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Painel Geral</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Tarefas Concluídas" 
          value={completedTasksCount} 
          icon={CheckCircle}
          color="bg-green-500"
        />
        <StatCard 
          title="Registos de Ponto" 
          value={timeLogsCount} 
          icon={Timer}
          color="bg-blue-500"
        />
        {/* Adicione mais cards aqui conforme necessário */}
      </div>

      <div className="mt-8">
        {/* Aqui poderíamos adicionar outros componentes, como gráficos ou atalhos */}
        <h3 className="text-xl font-bold mb-4">Atividade Recente</h3>
        <div className="bg-gray-800 p-6 rounded-lg">
          <p className="text-gray-400">Componentes de atividade recente virão aqui...</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;