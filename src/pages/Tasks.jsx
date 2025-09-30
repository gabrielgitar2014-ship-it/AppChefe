import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Trash2 } from 'lucide-react';

const TasksScreen = () => {
  const { tasks, addTask, deleteTask } = useData();
  const [inputText, setInputText] = useState('');

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (inputText.trim() === '') return;
    await addTask(inputText);
    setInputText('');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Gerir Tarefas Diárias</h2>
      <div className="space-y-4">
        <form onSubmit={handleAddTask} className="flex space-x-2">
          <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Nova tarefa..." className="flex-grow bg-gray-800 border border-gray-700 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 p-2 rounded">Adicionar</button>
        </form>
        <ul className="space-y-2">
          {tasks.map(task => (
            <li key={task.id} className="flex items-center justify-between bg-gray-800 p-3 rounded">
              <span className={task.completed ? 'line-through text-gray-500' : ''}>{task.text}</span>
              <button onClick={() => deleteTask(task.id)} className="hover:text-red-500"><Trash2 size={20} /></button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TasksScreen;
