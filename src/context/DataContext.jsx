import React, { useState, useEffect, useContext, createContext } from 'react';
import { supabase } from '../supabaseClient';

// 1. Cria o Contexto
const DataContext = createContext();

// 2. Cria um Hook customizado para facilitar o acesso
export const useData = () => {
  return useContext(DataContext);
};

// 3. Cria o Provedor que vai buscar e fornecer os dados
export const DataProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);
  const [timeLogs, setTimeLogs] = useState([]);
  const [configs, setConfigs] = useState([]); // MUDANÇA: Agora é uma lista de configs

  useEffect(() => {
    // Função para buscar todos os dados
    const fetchAllData = () => {
      supabase.from('dailyTasks').select('*').order('created_at', { ascending: false }).then(({ data }) => setTasks(data || []));
      supabase.from('shoppingList').select('*').order('created_at', { ascending: false }).then(({ data }) => setShoppingList(data || []));
      supabase.from('time_logs').select('*').order('clock_in_time', { ascending: false }).then(({ data }) => setTimeLogs(data || []));
      supabase.from('appConfig').select('*').order('id').then(({ data }) => setConfigs(data || [])); // MUDANÇA: Busca todas as configs
    };

    fetchAllData();

    const subscription = supabase.channel('schema-db-changes').on(
      'postgres_changes', { event: '*', schema: 'public' },
      (payload) => {
        console.log('Mudança recebida!', payload);
        fetchAllData();
      }
    ).subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);
  
  // Funções para manipular os dados
  const addTask = async (text) => await supabase.from('dailyTasks').insert([{ text, completed: false }]);
  const deleteTask = async (id) => await supabase.from('dailyTasks').delete().eq('id', id);
  const clearShoppingList = async () => await supabase.from('shoppingList').delete().gt('id', 0);
  
  // MUDANÇA: Novas funções para CRUD de Configs
  const addConfig = async (newConfig) => await supabase.from('appConfig').insert([newConfig]);
  const updateConfig = async (id, updatedConfig) => await supabase.from('appConfig').update(updatedConfig).eq('id', id);
  const deleteConfig = async (id) => await supabase.from('appConfig').delete().eq('id', id);


  const value = {
    tasks,
    shoppingList,
    timeLogs,
    configs, // MUDANÇA: Exporta a lista
    addTask,
    deleteTask,
    clearShoppingList,
    addConfig, // MUDANÇA: Nova função
    updateConfig,
    deleteConfig, // MUDANÇA: Nova função
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

