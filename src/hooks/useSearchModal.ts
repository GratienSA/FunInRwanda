import { create } from "zustand";
import { Range } from 'react-date-range';

interface SearchModalStore {
    isOpen: boolean;
    filters: {
        category: string;
        activityType: string;
        difficulty: string;
        minPrice: number | null;
        maxPrice: number | null;
        minDuration: number | null;
        maxDuration: number | null;
        participants: number;
        ageRestriction: number | null;
        isInstantBook: boolean;
        location: { value: string; label: string } | null;
        dateRange: Range;
    };
    onOpen: () => void;
    onClose: () => void;
    setFilters: (filters: Partial<SearchModalStore['filters']>) => void;
    resetFilters: () => void;
}

const useSearchModal = create<SearchModalStore>((set) => ({
    isOpen: false,
    filters: {
        category: '',
        activityType: '',
        difficulty: '',
        minPrice: null,
        maxPrice: null,
        minDuration: null,
        maxDuration: null,
        participants: 1,
        ageRestriction: null,
        isInstantBook: false,
        location: null,
        dateRange: {
            startDate: new Date(),
            endDate: new Date(),
            key: 'selection'
        }
    },
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
    setFilters: (filters) => set((state) => ({
        filters: { ...state.filters, ...filters }
    })),
    resetFilters: () => set({
        filters: {
            category: '',
            activityType: '',
            difficulty: '',
            minPrice: null,
            maxPrice: null,
            minDuration: null,
            maxDuration: null,
            participants: 1,
            ageRestriction: null,
            isInstantBook: false,
            location: null,
            dateRange: {
                startDate: new Date(),
                endDate: new Date(),
                key: 'selection'
            }
        }
    }),
}));

export default useSearchModal;