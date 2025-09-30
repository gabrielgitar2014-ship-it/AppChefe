import React from 'react';
import { useData } from '../context/DataContext';

const ShoppingListScreen = () => {
  const { shoppingList, clearShoppingList } = useData();

  const handleClearList = async () => {
    if (window.confirm("Tem certeza que deseja apagar todos os itens da lista de compras?")) {
      await clearShoppingList();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Lista de Compras</h2>
        <button onClick={handleClearList} className="bg-red-600 hover:bg-red-700 p-2 rounded text-sm">Limpar Lista</button>
      </div>
      <ul className="space-y-2">
        {shoppingList.length > 0 ? shoppingList.map(item => (
          <li key={item.id} className="bg-gray-800 p-3 rounded">{item.text}</li>
        )) : <p className="text-gray-500">A lista de compras está vazia.</p>}
      </ul>
    </div>
  );
};

export default ShoppingListScreen;
