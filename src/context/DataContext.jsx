import React, { useState, useEffect, useContext, createContext } from 'react';
import { supabase } from '../supabaseClient';

const DataContext = createContext();

export const useData = () => {
  return useContext(DataContext);
};

export const DataProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [shoppingList, setShoppingList] = useState([]);
  const [timeLogs, setTimeLogs] = useState([]);
  const [configs, setConfigs] = useState([]);

  useEffect(() => {
    // MELHORIA: Usando async/await e Promise.all para mais robustez
    const fetchAllData = async () => {
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
      }
    };

    fetchAllData();

    const subscription = supabase.channel('schema-db-changes').on(
      'postgres_changes', { event: '*', schema: 'public' },
      (payload) => {
        console.log('Mudança no DB recebida, buscando dados novamente!', payload);
        fetchAllData(); // Refaz a busca de tudo ao receber uma atualização
      }
    ).subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);
  
  // CORREÇÃO: As funções agora atualizam o estado local para uma UI instantânea
  
  const addTask = async (text) => {
    const { data, error } = await supabase.from('dailyTasks').insert([{ text, completed: false }]).select().single();
    if (error) console.error("Erro ao adicionar tarefa:", error);
    else setTasks(currentTasks => [data, ...currentTasks]); // Atualiza o estado local
    return { data, error };
  };

  const deleteTask = async (id) => {
    const { error } = await supabase.from('dailyTasks').delete().eq('id', id);
    if (error) console.error("Erro ao deletar tarefa:", error);
    else setTasks(currentTasks => currentTasks.filter(task => task.id !== id)); // Atualiza o estado local
    return { error };
  };

  const clearShoppingList = async () => {
    const { error } = await supabase.from('shoppingList').delete().gt('id', 0);
    if (error) console.error("Erro ao limpar lista:", error);
    else setShoppingList([]); // Atualiza o estado local
    return { error };
  };
  
  const addConfig = async (newConfig) => {
    const { data, error } = await supabase.from('appConfig').insert([newConfig]).select().single();
    if(error) console.error("Erro ao adicionar config:", error);
    else setConfigs(currentConfigs => [...currentConfigs, data]);
    return { data, error };
  };

  const updateConfig = async (id, updatedFields) => {
    const { data, error } = await supabase.from('appConfig').update(updatedFields).eq('id', id).select().single();
    if(error) console.error("Erro ao atualizar config:", error);
    else setConfigs(currentConfigs => currentConfigs.map(c => c.id === id ? data : c));
    return { data, error };
  };

  const deleteConfig = async (id) => {
    const { error } = await supabase.from('appConfig').delete().eq('id', id);
    if(error) console.error("Erro ao deletar config:", error);
    else setConfigs(currentConfigs => currentConfigs.filter(c => c.id !== id));
    return { error };
  };

  const value = {
    tasks,
    shoppingList,
    timeLogs,
    configs,
    addTask,
    deleteTask,
    clearShoppingList,
    addConfig,
    updateConfig,
    deleteConfig,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};