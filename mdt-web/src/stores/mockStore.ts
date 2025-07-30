import { create } from 'zustand';
import { message } from 'antd';
import { mockService } from '../services/mockService';
import { Mock, CreateMockRequest, UpdateMockRequest } from '../services/types/mock';
import { TableParams } from '../services/types/common';

interface MockState {
  mocks: Mock[];
  loading: boolean;
  selectedMock: Mock | null;
  filters: TableParams;
  
  // Actions
  fetchMocks: () => Promise<void>;
  createMock: (data: CreateMockRequest) => Promise<Mock | undefined>;
  updateMock: (id: string, data: UpdateMockRequest) => Promise<Mock | undefined>;
  deleteMock: (id: string) => Promise<void>;
  setSelectedMock: (mock: Mock | null) => void;
  setFilters: (filters: Partial<TableParams>) => void;
  clearMocks: () => void;
}

export const useMockStore = create<MockState>((set, get) => ({
  mocks: [],
  loading: false,
  selectedMock: null,
  filters: {
    search: '',
    page: 1,
    pageSize: 20,
  },

  fetchMocks: async () => {
    set({ loading: true });
    try {
      const response = await mockService.getMocks(get().filters);
      set({ 
        mocks: response.mocks || [], 
        loading: false 
      });
    } catch (error) {
      set({ loading: false });
    }
  },

  createMock: async (data: CreateMockRequest) => {
    try {
      const newMock = await mockService.createMock(data);
      set(state => ({
        mocks: [...state.mocks, newMock]
      }));
      message.success('Mock创建成功');
      return newMock;
    } catch (error) {
      console.error('Create mock error:', error);
      return undefined;
    }
  },

  updateMock: async (id: string, data: UpdateMockRequest) => {
    try {
      const updatedMock = await mockService.updateMock(id, data);
      set(state => ({
        mocks: state.mocks.map(m => m.id === id ? updatedMock : m),
        selectedMock: state.selectedMock?.id === id ? updatedMock : state.selectedMock
      }));
      message.success('Mock更新成功');
      return updatedMock;
    } catch (error) {
      console.error('Update mock error:', error);
      return undefined;
    }
  },

  deleteMock: async (id: string) => {
    try {
      await mockService.deleteMock(id);
      set(state => ({
        mocks: state.mocks.filter(m => m.id !== id),
        selectedMock: state.selectedMock?.id === id ? null : state.selectedMock
      }));
      message.success('Mock删除成功');
    } catch (error) {
      console.error('Delete mock error:', error);
    }
  },

  setSelectedMock: (mock: Mock | null) => set({ selectedMock: mock }),

  setFilters: (filters: Partial<TableParams>) => {
    const newFilters = { ...get().filters, ...filters };
    set({ filters: newFilters });
    get().fetchMocks();
  },

  clearMocks: () => set({ mocks: [], selectedMock: null }),
}));