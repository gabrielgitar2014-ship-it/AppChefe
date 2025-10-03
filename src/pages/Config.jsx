import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Importação para o link de navegação
import { useData } from '../context/DataContext';
import { Save, Plus, Edit, Trash2, X } from 'lucide-react';

// Componente do Modal para Adicionar/Editar
const ConfigModal = ({ isOpen, onClose, onSave, config }) => {
  const [formState, setFormState] = useState({ lat: '', lon: '', tolerance: 100, clockInHour: 8, clockOutHour: 17 });

  useEffect(() => {
    if (config) {
      setFormState({
        id: config.id || null,
        lat: config.target_location?.lat || '',
        lon: config.target_location?.lon || '',
        tolerance: config.tolerance_meters || 100,
        clockInHour: config.hora_liberacao_entrada || 8,
        clockOutHour: config.hora_liberacao_saida || 17,
      });
    } else {
      // Reseta para o padrão quando se adiciona um novo
      setFormState({ lat: '', lon: '', tolerance: 100, clockInHour: 8, clockOutHour: 17 });
    }
  }, [config, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const dataToSave = {
      target_location: { lat: parseFloat(formState.lat), lon: parseFloat(formState.lon) },
      tolerance_meters: parseInt(formState.tolerance, 10),
      hora_liberacao_entrada: parseInt(formState.clockInHour, 10),
      hora_liberacao_saida: parseInt(formState.clockOutHour, 10),
    };
    onSave(formState.id, dataToSave);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">{config ? 'Editar Configuração' : 'Adicionar Configuração'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={24} /></button>
        </div>
        <div className="space-y-4">
          <div className="space-y-2"><label>Latitude</label><input name="lat" value={formState.lat} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded text-white" /></div>
          <div className="space-y-2"><label>Longitude</label><input name="lon" value={formState.lon} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded text-white" /></div>
          <div className="space-y-2"><label>Tolerância (metros)</label><input name="tolerance" type="number" value={formState.tolerance} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded text-white" /></div>
          <div className="space-y-2"><label>Hora de Entrada</label><input name="clockInHour" type="number" value={formState.clockInHour} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded text-white" /></div>
          <div className="space-y-2"><label>Hora de Saída</label><input name="clockOutHour" type="number" value={formState.clockOutHour} onChange={handleChange} className="w-full bg-gray-700 p-2 rounded text-white" /></div>
          <button onClick={handleSave} className="w-full bg-green-600 hover:bg-green-700 p-3 rounded flex items-center justify-center space-x-2 mt-4">
            <Save size={20} /><span>Salvar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente Principal da Página
const SettingsScreen = () => {
  const { configs = [], addConfig, updateConfig, deleteConfig } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState(null);

  const handleOpenModal = (config = null) => {
    setEditingConfig(config);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingConfig(null);
  };

  const handleSave = async (id, data) => {
    if (id) {
      await updateConfig(id, data);
    } else {
      await addConfig(data);
    }
    handleCloseModal();
  };
  
  const handleDelete = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir esta configuração?")) {
      await deleteConfig(id);
    }
  };

  return (
    <div>
      {/* Botão para voltar à página principal */}
      <Link to="/" className="text-blue-400 hover:underline mb-6 inline-block">
        &larr; Voltar ao Dashboard
      </Link>
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold">Configurações do App</h2>
        <button onClick={() => handleOpenModal()} className="bg-blue-600 hover:bg-blue-700 p-2 rounded flex items-center space-x-2 text-white px-4">
          <Plus size={20} /><span>Adicionar</span>
        </button>
      </div>

      <div className="space-y-3">
        {configs.length > 0 ? configs.map(config => (
          <div key={config.id} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
            <div>
              <p className="font-semibold">ID da Configuração: {config.id}</p>
              <p className="text-sm text-gray-400">Lat: {config.target_location?.lat}, Lon: {config.target_location?.lon}</p>
            </div>
            <div className="flex space-x-3">
              <button onClick={() => handleOpenModal(config)} className="text-gray-400 hover:text-white"><Edit size={20} /></button>
              <button onClick={() => handleDelete(config.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={20} /></button>
            </div>
          </div>
        )) : (
          <p className="text-gray-500 text-center py-4">Nenhuma configuração encontrada.</p>
        )}
      </div>

      <ConfigModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onSave={handleSave} 
        config={editingConfig} 
      />
    </div>
  );
};

export default SettingsScreen;
