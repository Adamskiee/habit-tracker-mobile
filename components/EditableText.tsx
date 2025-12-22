import React, { useState } from "react";
import { Pressable, Text, TextInput } from "react-native";

interface EditableTextProps {
  text: string | undefined;
  className?: string;
  onChangeText: React.Dispatch<React.SetStateAction<string | undefined>>;
}

const EditableText = ({
  text,
  onChangeText,
  className = "",
}: EditableTextProps) => {
  const [isEditing, setIsEditing] = useState(false);

  return isEditing ? (
    <TextInput
      className={className}
      value={text}
      autoFocus
      onChangeText={onChangeText}
      onBlur={() => setIsEditing(false)}
    />
  ) : (
    <Pressable onPress={() => setIsEditing(true)}>
      <Text className={className}>{text}</Text>
    </Pressable>
  );
};

export default EditableText;
