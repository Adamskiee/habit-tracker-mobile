type ModalType = "add-habit" | "habit-item" | "none";

interface HabitList {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

interface HabitEditProps {
  title?: string;
  description?: string;
  completed?: boolean;
}
