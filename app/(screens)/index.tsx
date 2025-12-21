import AddHabitModal from "@/components/AddHabitModal";
import HabitItem from "@/components/HabitItem";
import Fab from "@/components/ui/Fab";
import ViewHabitModal from "@/components/ViewHabitModal";
import { useHabits } from "@/hooks/useHabits";
import { useState } from "react";
import { FlatList, Text, View } from "react-native";

export default function Index() {
  const { habits} = useHabits();
  const [activeModal, setActiveModal] = useState<ModalType>("none");

  return (
    <View className="screen-view">
      <Text className="screen-header">Habits</Text>
      {
        <FlatList
          data={habits}
          renderItem={({ item }) => (
            <HabitItem
              title={item.title}
              id={item.id}
              completed={item.completed}
              setActiveModal={setActiveModal}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={<Text className="mx-auto">No Habits.</Text>}
          contentContainerStyle={{
            gap: 12,
          }}
        />
      }
      <Fab onPress={() => setActiveModal("add-habit")} />
      <AddHabitModal visible={activeModal === "add-habit"} setActiveModal={setActiveModal} />
      <ViewHabitModal visible={activeModal === "habit-item"} setActiveModal={setActiveModal}/>
    </View>
  );
}
