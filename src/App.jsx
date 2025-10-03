import React from 'react';

// 1. Importa o BrowserRouter para habilitar o roteamento em toda a aplicação.
import { BrowserRouter } from 'react-router-dom';

// 2. Importa o DataProvider para que todos os componentes possam acessar os dados centralizados.
// CORREÇÃO: O caminho foi ajustado para './DataContext.jsx'
import { DataProvider } from './context/DataContext';

// 3. Importa o MainLayout, que contém a estrutura visual (sidebar, etc.) e as rotas.
// CORREÇÃO: O caminho foi ajustado para './MainLayout.jsx'
import MainLayout from './components/MainLayout.jsx';

/**
 * Componente raiz da aplicação.
 * Responsável por configurar os provedores de contexto globais, como o roteador e o provedor de dados.
 */
function App() {
  return (
    // O BrowserRouter "ativa" o sistema de rotas para qualquer componente filho.
    <BrowserRouter>
      {/* O DataProvider envolve a aplicação para fornecer acesso global ao estado e às funções de dados. */}
      <DataProvider>
        {/* O MainLayout renderiza a interface principal e o conteúdo da página atual com base na URL. */}
        <MainLayout />
      </DataProvider>
    </BrowserRouter>
  );
}

export default App;

