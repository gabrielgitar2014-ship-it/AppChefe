import React, { useState, useEffect, useContext, createContext, useCallback } from 'react';
// Caminho de importação corrigido para o cliente Supabase
import { supabase } from './supabaseClient.js'; 

// 1. Cria o Contexto
const DataContext = createContext();

// 2. Cria um hook customizado para facilitar o acesso
export const useData = () => {
  return useContext(DataContext);
};

// 3. Cria o Provedor que vai buscar e fornecer os dados
export const DataProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);
  const [timeLogs, setTimeLogs] = useState([]);
  const [configs, setConfigs] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar o carregamento

  // Memoiza a função de busca de dados para evitar recriação a cada renderização
  const fetchAllData = useCallback(async () => {
    setIsLoading(true); // Define como carregando antes de buscar
    try {
      const [
        tasksResponse,
        shoppingResponse,
        logsResponse,
        configResponse
      ] = await Promise.all([
        supabase.from('dailyTasks').select('*').order('created_at', { ascending: false }),
        supabase.from('shoppingList').select('*').order('created_at', { ascending: false }),
        supabase.from('time_logs').select('*').order('clock_in_time', { ascending: false }),
        supabase.from('appConfig').select('*').order('id')
      ]);

      setTasks(tasksResponse.data || []);
      setShoppingList(shoppingResponse.data || []);
      setTimeLogs(logsResponse.data || []);
      setConfigs(configResponse.data || []);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setIsLoading(false); // Define como não carregando após a busca terminar
    }
  }, []);

  useEffect(() => {
    fetchAllData(); // Busca inicial de dados

    // Inscrição para mudanças em tempo real
    const subscription = supabase.channel('schema-db-changes').on(
      'postgres_changes', { event: '*', schema: 'public' },
      (payload) => {
        console.log('Mudança recebida!', payload);
        fetchAllData(); // Busca novamente os dados em qualquer mudança
      }
    ).subscribe();

    // Limpa a inscrição ao desmontar o componente
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [fetchAllData]);
  
  // Funções de manipulação de dados (com atualizações otimistas da UI)
  const addTask = async (text) => {
    const { data, error } = await supabase.from('dailyTasks').insert([{ text, completed: false }]).select().single();
    if (!error) setTasks(current => [data, ...current]);
    return { data, error };
  };
  const deleteTask = async (id) => {
    const { error } = await supabase.from('dailyTasks').delete().eq('id', id);
    if (!error) setTasks(current => current.filter(task => task.id !== id));
    return { error };
  };
  const clearShoppingList = async () => {
    const { error } = await supabase.from('shoppingList').delete().gt('id', 0);
    if (!error) setShoppingList([]);
    return { error };
  };
  const addConfig = async (newConfig) => {
    const { data, error } = await supabase.from('appConfig').insert([newConfig]).select().single();
    if (!error) setConfigs(current => [...current, data]);
    return { data, error };
  };
  const updateConfig = async (id, updatedConfig) => {
    const { data, error } = await supabase.from('appConfig').update(updatedConfig).eq('id', id).select().single();
    if (!error) setConfigs(current => current.map(c => c.id === id ? data : c));
    return { data, error };
  };
  const deleteConfig = async (id) => {
    const { error } = await supabase.from('appConfig').delete().eq('id', id);
    if (!error) setConfigs(current => current.filter(c => c.id !== id));
    return { error };
  };

  const value = {
    tasks,
    shoppingList,
    timeLogs,
    configs,
    isLoading, // Fornece o estado de carregamento
    refreshData: fetchAllData, // Fornece a função de atualização
    addTask,
    deleteTask,
    clearShoppingList,
    addConfig,
    updateConfig,
    deleteConfig,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

