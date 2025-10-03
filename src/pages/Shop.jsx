import React from 'react';
import { Link } from 'react-router-dom'; // Importação para o link de navegação
import { useData } from '../context/DataContext';

const ShoppingListScreen = () => {
  const { shoppingList = [], clearShoppingList } = useData();

  // Função para limpar a lista
  const handleClearList = async () => {
    // NOTA: window.confirm() pode ter um comportamento inconsistente em alguns ambientes.
    // Uma alternativa seria criar um componente de modal de confirmação customizado.
    if (window.confirm("Tem certeza que deseja apagar todos os itens da lista de compras?")) {
      await clearShoppingList();
    }
  };

  return (
    <div>
      {/* Botão para voltar à página principal */}
      <Link to="/" className="text-blue-400 hover:underline mb-6 inline-block">
        &larr; Voltar ao Dashboard
      </Link>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold">Lista de Compras</h2>
        <button 
          onClick={handleClearList} 
          className="bg-red-600 hover:bg-red-700 p-2 rounded text-sm text-white font-semibold px-4 disabled:opacity-50"
          // Desabilita o botão se a lista estiver vazia
          disabled={shoppingList.length === 0}
        >
          Limpar Lista
        </button>
      </div>

      <ul className="space-y-2">
        {shoppingList.length > 0 ? shoppingList.map(item => (
          <li key={item.id} className="bg-gray-800 p-3 rounded text-white">
            {item.text}
          </li>
        )) : (
          <p className="text-gray-500 text-center py-4">A lista de compras está vazia.</p>
        )}
      </ul>
    </div>
  );
};

export default ShoppingListScreen;

