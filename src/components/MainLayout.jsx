import React, { useState } from 'react';
import { ClipboardList, ShoppingCart, Settings, Home, Timer } from 'lucide-react';

// Importa as páginas
import TasksScreen from '../pages/Tasks';
import ShoppingListScreen from '../pages/Shop';
import SettingsScreen from '../pages/Config';
import TimeLogScreen from '../pages/Ponto';

const MainLayout = () => {
  const [view, setView] = useState('tasks');

  const renderView = () => {
    switch (view) {
      case 'tasks': return <TasksScreen />;
      case 'shopping': return <ShoppingListScreen />;
      case 'settings': return <SettingsScreen />;
      case 'timeLog': return <TimeLogScreen />;
      default: return <TasksScreen />;
    }
  };

  const NavButton = ({ viewName, icon: Icon, label }) => (
    <button
      onClick={() => setView(viewName)}
      className={`flex items-center space-x-3 w-full text-left p-3 rounded-lg transition-colors ${view === viewName ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 text-gray-300'}`}
    >
      <Icon size={22} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-gray-900 text-white font-sans">
      <aside className="w-64 bg-gray-800 p-4 flex flex-col">
        <div className="flex items-center space-x-2 mb-8">
          <Home size={28} className="text-blue-400"/>
          <h1 className="text-xl font-bold">Painel Gestor</h1>
        </div>
        <nav className="flex flex-col space-y-2">
          <NavButton viewName="tasks" icon={ClipboardList} label="Tarefas" />
          <NavButton viewName="timeLog" icon={Timer} label="Registro de Ponto" />
          <NavButton viewName="shopping" icon={ShoppingCart} label="Compras" />
          <NavButton viewName="settings" icon={Settings} label="Configurações" />
        </nav>
      </aside>
      <main className="flex-1 p-6 overflow-y-auto">
        {renderView()}
      </main>
    </div>
  );
};

export default MainLayout;
