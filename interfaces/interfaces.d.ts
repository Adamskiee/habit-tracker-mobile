type ModalType = "add-habit" | "habit-item" | "none";

interface HabitList {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  updatedAt: string;
}

interface HabitEditProps {
  title?: string;
  description?: string;
  completed?: boolean;
  updatedAt?: string;
}

interface Habit {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  updatedAt: string;
}
