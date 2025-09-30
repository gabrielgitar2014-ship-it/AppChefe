import React, { useState } from 'react';
import { ClipboardList, ShoppingCart, Settings, Home, Timer, Menu, X } from 'lucide-react';
import TasksScreen from '../pages/Tasks';
import ShoppingListScreen from '../pages/Shop';
import SettingsScreen from '../pages/Config';
import TimeLogScreen from '../pages/Ponto';

// ===================================================================
// COMPONENTE DE LAYOUT PRINCIPAL (MainLayout)
// Agora com um estado para controlar o sidebar.
// ===================================================================
const MainLayout = () => {
  const [view, setView] = useState('tasks');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Estado para o sidebar

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
      className={`flex items-center space-x-3 w-full text-left p-3 rounded-lg transition-colors ${
        view === viewName 
          ? 'bg-blue-600 text-white' 
          : 'hover:bg-gray-700 text-gray-300'
      } ${!isSidebarOpen ? 'justify-center' : ''}`}
    >
      <Icon size={22} />
      {/* Mostra o texto apenas se o sidebar estiver aberto */}
      <span className={`font-medium transition-opacity duration-200 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 h-0 w-0'}`}>
        {isSidebarOpen && label}
      </span>
    </button>
  );

  return (
    <div className="flex h-screen bg-gray-900 text-white font-sans">
      {/* Sidebar */}
      <aside
        className={`bg-gray-800 flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'w-64' : 'w-20'
        } p-4`}
      >
        <div className={`flex items-center mb-8 ${isSidebarOpen ? 'justify-between' : 'justify-center'}`}>
          {isSidebarOpen && (
             <div className="flex items-center space-x-2">
                <Home size={28} className="text-blue-400"/>
                <h1 className="text-xl font-bold">Painel Gestor</h1>
            </div>
          )}
          {/* Botão de fechar dentro do sidebar (visível apenas em ecrãs maiores) */}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="hidden lg:block p-1 rounded-full hover:bg-gray-700">
             {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        
        <nav className="flex flex-col space-y-2">
          <NavButton viewName="tasks" icon={ClipboardList} label="Tarefas" />
          <NavButton viewName="timeLog" icon={Timer} label="Registo de Ponto" />
          <NavButton viewName="shopping" icon={ShoppingCart} label="Compras" />
          <NavButton viewName="settings" icon={Settings} label="Configurações" />
        </nav>
      </aside>

      {/* Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
         {/* Header da área de conteúdo com o botão de menu para ecrãs menores */}
        <header className="bg-gray-800 shadow-md p-4 flex items-center lg:hidden">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 rounded-full hover:bg-gray-700">
                <Menu size={24} />
            </button>
            <h2 className="ml-4 text-lg font-semibold">Painel Gestor</h2>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;

