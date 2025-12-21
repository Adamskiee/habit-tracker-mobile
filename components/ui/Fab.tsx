import { Plus } from "@/constants/expo-icons";
import React from "react";
import { TouchableHighlight, View } from "react-native";

interface FabProps {
  onPress: () => void
}

const Fab = ({onPress}:FabProps) => {
  return (
    <TouchableHighlight onPress={onPress}>
      <View className="absolute right-4 bottom-8 bg-blue-400 rounded-full p-3">
        <Plus name="plus" size={40} color="white" />
      </View>
    </TouchableHighlight>
  );
};

export default Fab;
