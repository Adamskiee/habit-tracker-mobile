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
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
  getHabit: (id: number) => HabitList | undefined;
  addHabit: (title: string, description: string) => void;
  toggleHabit: (id: number) => Promise<void>;
  deleteHabit: (id: number) => Promise<void>;
  updateHabit: (id: number, habit: HabitEditProps) => Promise<void>;
  deleteAllHabits: () => Promise<void>;
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
    console.log("mount");
  }, []);

  const loadHabits = async () => {
    try {
      setLoading(true);
      const loadedHabits = await HabitStorageService.getAllHabits();
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

      if (res.success && res.data) {
        setHabits([...habits, res.data]);
      } else {
        throw new Error(res.message);
      }
    } catch (error) {
      await loadHabits();
      setError(error instanceof Error ? error : new Error("An error occured"));
    }
  };

  // DELETE
  const deleteHabit = async (id: number) => {
    try {
      await HabitStorageService.deleteHabit(id);
      setHabits(habits.filter((habit) => habit.id !== id));
    } catch (error) {
      setError(error instanceof Error ? error : new Error("An error occured"));
      await loadHabits();
    }
  };

  const deleteAllHabits = async () => {
    try {
      await HabitStorageService.deleteAllhabit();
      setHabits([]);
    } catch (error) {
      console.error(error);
      await loadHabits();
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
      const res = await HabitStorageService.toggleHabitCompletion(id);

      if (res.success && res.data) {
        setHabits(habits.map((habit) => (habit.id === id ? res.data! : habit)));
      } else {
        throw Error(res.message);
      }
    } catch (error) {
      console.error(error);
      await loadHabits();
    }
  };

  const updateHabit = async (id: number, updates: HabitEditProps) => {
    try {
      const res = await HabitStorageService.updateHabit(id, updates);

      if (res.success && res.data) {
        setHabits(habits.map((habit) => (habit.id === id ? res.data! : habit)));
      } else {
        throw new Error(res.message);
      }
    } catch (error) {
      console.error("Error updating habits: ", error);
      await loadHabits();
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
        deleteAllHabits,
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
