import { View, Text } from "react-native";
import React, { useState } from "react";
import Button from "@/components/ui/Button";
import { auth } from "@/config/firebase";
import { signOut } from "firebase/auth";
import { FirebaseError } from "firebase/app";

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const handleLogout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
    } catch (error) {
      const err = error as FirebaseError;
      console.log("Login failed: ", err.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <View className="screen-view">
      <Text className="screen-header">Settings</Text>
      <View>
        <Button text="Logout" onPress={handleLogout} />
      </View>
    </View>
  );
};

export default Settings;
