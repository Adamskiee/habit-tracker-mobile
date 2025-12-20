import Button from "@/components/ui/Button";
import { useHabits } from "@/hooks/useHabits";
import React, { useState } from "react";
import { Text, TextInput, View } from "react-native";

const AddHabit = () => {
  const { addHabit } = useHabits();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleAddHabit = () => {
    if (!title || !description) {
      return;
    }

    addHabit(title, description);
    setTitle("")
    setDescription("")
  };

  return (
        <View className="screen-view">
          <Text className="font-bold mt-20 mb-5 mx-auto text-2xl">
            Add Habit
          </Text>

          <View className="gap-4">
            <TextInput
              keyboardType="default"
              className="border border-gray-400 h-11 p-3 bg-white rounded-2xl"
              onChangeText={setTitle}
              placeholder="Title"
              value={title}
            />
            <TextInput
              keyboardType="default"
              multiline
              textAlignVertical="top"
              className="border border-gray-400 p-3 bg-white rounded-2xl h-32"
              numberOfLines={5}
              maxLength={200}
              onChangeText={setDescription}
              placeholder="Description"
              value={description}
            />

            <Button onPress={handleAddHabit} text="Submit" />
          </View>
        </View>
  );
};

export default AddHabit;
