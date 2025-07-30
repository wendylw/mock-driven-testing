import { create } from 'zustand';
import { message } from 'antd';
import { scenarioService } from '../services/scenarioService';
import { Scenario, CreateScenarioRequest, UpdateScenarioRequest } from '../services/types/scenario';
import { TableParams } from '../services/types/common';

interface ScenarioState {
  scenarios: Scenario[];
  loading: boolean;
  selectedScenario: Scenario | null;
  activeScenario: Scenario | null;
  filters: TableParams;
  
  // Actions
  fetchScenarios: () => Promise<void>;
  fetchActiveScenario: () => Promise<void>;
  createScenario: (data: CreateScenarioRequest) => Promise<Scenario | undefined>;
  updateScenario: (id: string, data: UpdateScenarioRequest) => Promise<Scenario | undefined>;
  deleteScenario: (id: string) => Promise<void>;
  activateScenario: (id: string) => Promise<void>;
  cloneScenario: (id: string, newName?: string) => Promise<void>;
  setSelectedScenario: (scenario: Scenario | null) => void;
  setFilters: (filters: Partial<TableParams>) => void;
  clearScenarios: () => void;
}

export const useScenarioStore = create<ScenarioState>((set, get) => ({
  scenarios: [],
  loading: false,
  selectedScenario: null,
  activeScenario: null,
  filters: {
    search: '',
    page: 1,
    pageSize: 20,
  },

  fetchScenarios: async () => {
    set({ loading: true });
    try {
      const response = await scenarioService.getScenarios(get().filters);
      set({ 
        scenarios: response.scenarios || [], 
        loading: false 
      });
    } catch (error) {
      set({ loading: false });
    }
  },

  fetchActiveScenario: async () => {
    try {
      const activeScenario = await scenarioService.getActiveScenario();
      set({ activeScenario });
    } catch (error) {
      console.error('Fetch active scenario error:', error);
    }
  },

  createScenario: async (data: CreateScenarioRequest) => {
    try {
      const newScenario = await scenarioService.createScenario(data);
      set(state => ({
        scenarios: [...state.scenarios, newScenario]
      }));
      message.success('场景创建成功');
      return newScenario;
    } catch (error) {
      console.error('Create scenario error:', error);
      return undefined;
    }
  },

  updateScenario: async (id: string, data: UpdateScenarioRequest) => {
    try {
      const updatedScenario = await scenarioService.updateScenario(id, data);
      set(state => ({
        scenarios: state.scenarios.map(s => s.id === id ? updatedScenario : s),
        selectedScenario: state.selectedScenario?.id === id ? updatedScenario : state.selectedScenario,
        activeScenario: state.activeScenario?.id === id ? updatedScenario : state.activeScenario
      }));
      message.success('场景更新成功');
      return updatedScenario;
    } catch (error) {
      console.error('Update scenario error:', error);
      return undefined;
    }
  },

  deleteScenario: async (id: string) => {
    try {
      await scenarioService.deleteScenario(id);
      set(state => ({
        scenarios: state.scenarios.filter(s => s.id !== id),
        selectedScenario: state.selectedScenario?.id === id ? null : state.selectedScenario,
        activeScenario: state.activeScenario?.id === id ? null : state.activeScenario
      }));
      message.success('场景删除成功');
    } catch (error) {
      console.error('Delete scenario error:', error);
    }
  },

  activateScenario: async (id: string) => {
    try {
      const scenario = await scenarioService.activateScenario(id);
      set(state => ({
        scenarios: state.scenarios.map(s => ({ ...s, active: s.id === id })),
        activeScenario: scenario
      }));
      message.success(`场景"${scenario.name}"已激活`);
    } catch (error) {
      console.error('Activate scenario error:', error);
    }
  },

  cloneScenario: async (id: string, newName?: string) => {
    try {
      const clonedScenario = await scenarioService.cloneScenario(id, newName);
      set(state => ({
        scenarios: [...state.scenarios, clonedScenario]
      }));
      message.success('场景克隆成功');
    } catch (error) {
      console.error('Clone scenario error:', error);
    }
  },

  setSelectedScenario: (scenario: Scenario | null) => set({ selectedScenario: scenario }),

  setFilters: (filters: Partial<TableParams>) => {
    const newFilters = { ...get().filters, ...filters };
    set({ filters: newFilters });
    get().fetchScenarios();
  },

  clearScenarios: () => set({ scenarios: [], selectedScenario: null, activeScenario: null }),
}));