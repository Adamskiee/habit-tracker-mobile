import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import { HabitStorageService } from "@/services";

interface HabitsContextType {
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<HabitList[]>>;
  getHabit: (id: number) => HabitList | undefined;
  addHabit: (title: string, description: string) => void;
  toggleHabit: (id: number) => Promise<void>;
  deleteHabit: (id: number) => Promise<void>;
  updateHabit: (id: number, habit: HabitEditProps) => Promise<void>;
  loading: boolean;
  error: Error | null;
  activeHabit: number;
  setActiveHabit: React.Dispatch<React.SetStateAction<number>>;
}

const HabitsContext = createContext<HabitsContextType | undefined>(undefined);

export const HabitsProvider = ({ children }: { children: ReactNode }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  // for habit view modal in index.tsx to know what is the pressed habit item
  const [activeHabit, setActiveHabit] = useState<number>(-1);

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    try {
      setLoading(true);
      const loadedHabits = await HabitStorageService.getAllHabits();
      console.log("haha");
      setHabits(loadedHabits);
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error : new Error("An error occured"));
    } finally {
      setLoading(false);
    }
  };

  // CREATE
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

  // DELETE
  const deleteHabit = async (id: number) => {
    try {
      await HabitStorageService.deteteHabit(id);
      await loadHabits();
    } catch (error) {
      setError(error instanceof Error ? error : new Error("An error occured"));
    }
  };

  // READ
  const getHabit = (id: number) => {
    try {
      return habits.find((habit) => habit.id === id);
    } catch (error) {
      setError(error instanceof Error ? error : new Error("An error occured"));
      return undefined;
    }
  };

  // UPDATE
  const toggleHabit = async (id: number) => {
    try {
      await HabitStorageService.toggleHabitCompletion(id);
      await loadHabits();
    } catch (error) {
      console.error(error);
    }
  };

  const updateHabit = async (id: number, habit: HabitEditProps) => {
    try {
      await HabitStorageService.updateHabit(id, habit);
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
        deleteHabit,
        updateHabit,
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
