import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { HabitStorageService } from "@/services";

interface HabitList {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

interface HabitsContextType {
  habits: HabitList[];
  setHabits: React.Dispatch<React.SetStateAction<HabitList[]>>;
  getHabit: (id: string) => HabitList | null;
  addHabit: (title: string, description: string) => void;
  toggleHabit: (id: string) => void;
  loading: boolean;
  error: Error | null;
  activeHabit: string;
  setActiveHabit: React.Dispatch<React.SetStateAction<string>>;
}

const HabitsContext = createContext<HabitsContextType | undefined>(undefined);

export const HabitsProvider = ({ children }: { children: ReactNode }) => {
  const [habits, setHabits] = useState<HabitList[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  // for habit view modal in index.tsx to know what is the pressed habit item
  const [activeHabit, setActiveHabit] = useState("");
  
  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    try {
      setLoading(true);
      const loadedHabits = await HabitStorageService.getAllHabits();

      setHabits(loadedHabits);
    } catch (error) {
      setError(error instanceof Error ? error : new Error("An error occured"));
    } finally {
      setLoading(false);
    }
  };

  const addHabit = async (title: string, description: string) => {
    try {
      setLoading(true);
      const res = await HabitStorageService.createHabit({ title, description });

      if (res.success) {
        await loadHabits();
      } else {
        throw new Error(res.message);
      }
    } catch (error) {
      setError(error instanceof Error ? error : new Error("An error occured"));
    }
  };

  const getHabit = (id: string) => {
    try {
      return habits.find((habit) => habit.id === id) || null;
    } catch (error) {
      setError(error instanceof Error ? error : new Error("An error occured"));
      return null;
    }
  };

  const toggleHabit = async (id: string) => {
    try {
      await HabitStorageService.toggleHabitCompletion(id);
      await loadHabits();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <HabitsContext.Provider
      value={{
        habits,
        setHabits,
        addHabit,
        getHabit,
        toggleHabit,
        loading,
        error,
        activeHabit,
        setActiveHabit,
      }}
    >
      {children}
    </HabitsContext.Provider>
  );
};

export const useHabits = () => {
  const context = useContext(HabitsContext);
  if (!context) {
    throw new Error("useHabits must be used within HabitsProvider");
  }
  return context;
};
