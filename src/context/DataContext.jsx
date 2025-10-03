import React, { useState, useEffect, useContext, createContext, useCallback } from 'react';
// Caminho de importação corrigido para o cliente Supabase
import { supabase } from '../supabaseClient.js'; 

// 1. Cria o Contexto
const DataContext = createContext();

// 2. Cria um hook customizado para facilitar o acesso nos componentes
export const useData = () => {
  return useContext(DataContext);
};

// 3. Cria o Provedor que vai gerir todos os dados da aplicação
export const DataProvider = ({ children }) => {
  // Estados para os dados brutos vindos do Supabase
  const [tasks, setTasks] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);
  const [timeLogs, setTimeLogs] = useState([]);
  const [configs, setConfigs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Estado específico para a contagem de pontos que têm entrada E saída
  const [completedTimeLogsCount, setCompletedTimeLogsCount] = useState(0);

  // Função central para buscar e processar todos os dados
  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
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

      // Processa os registos de ponto primeiro para calcular a contagem correta
      const timeLogsData = logsResponse.data || [];
      setTimeLogs(timeLogsData);

      // A lógica principal: filtra os logs que têm tanto entrada quanto saída
      const completedLogs = timeLogsData.filter(log => log.clock_in_time && log.clock_out_time);
      setCompletedTimeLogsCount(completedLogs.length);

      // Define os outros estados
      setTasks(tasksResponse.data || []);
      setShoppingList(shoppingResponse.data || []);
      setConfigs(configResponse.data || []);

    } catch (error) {
      console.error("Erro ao buscar dados do Supabase:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Efeito para buscar os dados na montagem do componente e ouvir atualizações
  useEffect(() => {
    fetchAllData();
    
    const subscription = supabase.channel('schema-db-changes').on(
      'postgres_changes', { event: '*', schema: 'public' },
      (payload) => {
        console.log('Mudança no banco de dados recebida, atualizando dados...', payload);
        fetchAllData();
      }
    ).subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [fetchAllData]);
  
  // Funções para manipular os dados, com atualização otimista da UI
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

  // Objeto com todos os valores e funções que serão disponibilizados para a aplicação
  const value = {
    tasks,
    shoppingList,
    timeLogs,
    configs,
    isLoading,
    completedTimeLogsCount, // A nova contagem correta
    refreshData: fetchAllData, // Função para o botão de atualizar
    addTask,
    deleteTask,
    clearShoppingList,
    addConfig,
    updateConfig,
    deleteConfig,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

children}</DataContext.Provider>;
};



