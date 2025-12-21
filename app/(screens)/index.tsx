import HabitItem from "@/components/HabitItem";
import { useHabits } from "@/hooks/useHabits";
import { FlatList, Text, View } from "react-native";

export default function Index() {
  const { habits } = useHabits();

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
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={<Text className="mx-auto">No Habits.</Text>}
          contentContainerStyle={{
            gap:12
          }}
        />
      }
    </View>
  );
}
