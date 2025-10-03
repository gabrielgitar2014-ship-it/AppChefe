import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Timer, 
  ShoppingCart, 
  Settings, 
  CheckCircle
} from 'lucide-react';

// ===================================================================
// IMPORTAÇÃO DAS PÁGINAS REAIS
// ===================================================================
import TasksScreen from '../pages/Tasks';
import ShoppingListScreen from '../pages/Shop';
import TimeLogScreen from '../pages/Ponto';
import SettingsScreen from '../pages/Config';


// ===================================================================
// COMPONENTES DE UI (continuam aqui para simplicidade)
// ===================================================================
const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-gray-800/50 backdrop-blur-sm border border-white/10 p-6 rounded-lg flex items-center space-x-4">
    <div className={`p-3 rounded-full ${color}`}>
      <Icon size={24} className="text-white" />
    </div>
    <div>
      <p className="text-gray-300 text-sm font-medium uppercase tracking-wider">{title}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  </div>
);

const NavIcon = ({ to, icon: Icon, label }) => (
  <Link to={to} className="flex flex-col items-center gap-2 text-gray-300 hover:text-white transition-colors group">
    <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:bg-white/20 transition-all">
      <Icon size={40} />
    </div>
    <span className="font-medium text-sm">{label}</span>
  </Link>
);

// O Dashboard continua definido aqui, pois serve como o nosso "hub" principal.
const DashboardPage = () => {
  const { tasks = [], timeLogs = [] } = useData();
  const completedTasksCount = tasks.filter(task => task.completed).length;
  const timeLogsCount = timeLogs.length;

  return (
    <div className="p-4 sm:p-6 space-y-10">
      <div>
        <h2 className="text-2xl font-bold mb-4 text-white">Resumo Geral</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        </div>
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-6 text-white text-center">Explorar Secções</h2>
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          <NavIcon to="/tarefas" icon={ClipboardList} label="Tarefas" />
          <NavIcon to="/ponto" icon={Timer} label="Ponto" />
          <NavIcon to="/compras" icon={ShoppingCart} label="Compras" />
          <NavIcon to="/config" icon={Settings} label="Configurações" />
        </div>
      </div>
    </div>
  );
};


// ===================================================================
// COMPONENTE PRINCIPAL DO LAYOUT
// ===================================================================
function MainLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-indigo-900 text-white font-sans">
      <header className="p-4 text-center">
        <h1 className="text-xl font-bold text-white/90 flex items-center justify-center gap-2">
          <LayoutDashboard />
          <span>Painel Gestor</span>
        </h1>
      </header>

      <main className="max-w-4xl mx-auto p-4 sm:p-6">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/tarefas" element={<TasksScreen />} />
          <Route path="/ponto" element={<TimeLogScreen />} />
          <Route path="/compras" element={<ShoppingListScreen />} />
          <Route path="/config" element={<SettingsScreen />} />
        </Routes>
      </main>
    </div>
  );
}

export default MainLayout;