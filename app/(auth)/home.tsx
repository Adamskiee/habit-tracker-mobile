import AddHabitModal from "@/components/AddHabitModal";
import HabitItem from "@/components/HabitItem";
import Button from "@/components/ui/Button";
import Fab from "@/components/ui/Fab";
import ViewHabitModal from "@/components/ViewHabitModal";
import { useHabits } from "@/hooks/useHabits";
import SyncManager from "@/services/storage/SyncManager";
import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";

export default function Index() {
  const { habits } = useHabits();
  const [activeModal, setActiveModal] = useState<ModalType>("none");
  const [isWifiConnected, setIsWifiConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsWifiConnected(state.isConnected);
      console.log("Connection status: ", state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const syncData = async () => {
      try {
        if (isWifiConnected === true) {
          console.log("Wifi connected");
          await SyncManager.startSync();
          await SyncManager.pushLocalChanges();
        }
      } catch (error) {
        console.error("Background sync error: ", error);
      }
    };
    syncData();
  }, [isWifiConnected]);

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
          ListEmptyComponent={
            <View className="min-h-96 justify-center items-center gap-8">
              <Text className="text-5xl">No Habits.</Text>
              <Button
                onPress={() => setActiveModal("add-habit")}
                text="Add habit"
                className="p-6 rounded-3xl"
                textClassName="text-3xl"
              />
            </View>
          }
          contentContainerStyle={{
            gap: 12,
          }}
        />
      }
      <Fab onPress={() => setActiveModal("add-habit")} />
      <AddHabitModal
        visible={activeModal === "add-habit"}
        setActiveModal={setActiveModal}
      />
      <ViewHabitModal
        visible={activeModal === "habit-item"}
        setActiveModal={setActiveModal}
      />
    </View>
  );
}
