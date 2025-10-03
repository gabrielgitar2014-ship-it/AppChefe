import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Importação para o link de navegação
import { useData } from '../context/DataContext';
import { Trash2 } from 'lucide-react';

const TasksScreen = () => {
  // Acessa os dados e funções do DataContext
  const { tasks = [], addTask, deleteTask } = useData();
  const [inputText, setInputText] = useState('');

  // Função para lidar com o envio do formulário
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (inputText.trim() === '') return;
    await addTask(inputText);
    setInputText(''); // Limpa o campo de texto após adicionar
  };

  return (
    <div>
      {/* Botão para voltar à página principal */}
      <Link to="/" className="text-blue-400 hover:underline mb-6 inline-block">
        &larr; Voltar ao Dashboard
      </Link>

      <h2 className="text-3xl font-bold mb-4">Gerir Tarefas Diárias</h2>

      <div className="space-y-4">
        {/* Formulário para adicionar novas tarefas */}
        <form onSubmit={handleAddTask} className="flex space-x-2">
          <input 
            type="text" 
            value={inputText} 
            onChange={(e) => setInputText(e.target.value)} 
            placeholder="Nova tarefa..." 
            className="flex-grow bg-gray-800 border border-gray-700 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white" 
          />
          <button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700 p-2 rounded text-white font-semibold px-4"
          >
            Adicionar
          </button>
        </form>

        {/* Lista de tarefas */}
        <ul className="space-y-2">
          {tasks.length > 0 ? tasks.map(task => (
            <li 
              key={task.id} 
              className="flex items-center justify-between bg-gray-800 p-3 rounded transition-all"
            >
              <span className={task.completed ? 'line-through text-gray-500' : 'text-white'}>
                {task.text}
              </span>
              <button 
                onClick={() => deleteTask(task.id)} 
                className="text-gray-400 hover:text-red-500"
                aria-label="Excluir tarefa"
              >
                <Trash2 size={20} />
              </button>
            </li>
          )) : (
            <p className="text-gray-500 text-center py-4">Nenhuma tarefa encontrada.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default TasksScreen;

