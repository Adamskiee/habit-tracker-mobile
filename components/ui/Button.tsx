import React from "react";
import { Pressable, Text } from "react-native";

interface ButtonProps {
  onPress: () => void;
  text: string;
  className?: string;
  textClassName?: string;
}

const Button = ({
  onPress,
  className = "",
  textClassName = "",
  text,
}: ButtonProps) => {
  return (
    <Pressable onPress={onPress} className={`btn ${className}`}>
      <Text className={`text-white font-medium ${textClassName}`}>{text}</Text>
    </Pressable>
  );
};

export default Button;
