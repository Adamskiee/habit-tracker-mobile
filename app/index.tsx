import Button from "@/components/ui/Button";
import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Text, TextInput, View } from "react-native";
import { auth } from "@/config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";

const Index = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      if (email.trim() === "" || password.trim() === "") {
        return;
      }

      console.log(email, password);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      const err = error as FirebaseError;
      console.log("Login failed: ", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    setLoading(true);
    try {
      if (email.trim() === "" || password.trim() === "") {
        return;
      }

      console.log(email, password);
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      const err = error as FirebaseError;
      console.log("Signup failed: ", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="justify-center flex-1 px-3 gap-6">
      <KeyboardAvoidingView className="gap-4">
        <View>
          <Text className="font-bold text-2xl">Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            className="border border-gray-400 px-4 font-medium bg-white rounded-2xl text-2xl placeholder:text-gray-400"
            placeholder="Email Address"
          />
        </View>
        <View>
          <Text className="font-bold text-2xl">Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            autoCapitalize="none"
            className="border border-gray-400 px-4 font-medium bg-white rounded-2xl text-2xl placeholder:text-gray-400"
            placeholder="Password"
            secureTextEntry
          />
        </View>
      </KeyboardAvoidingView>
      <Button text="Login" onPress={handleLogin} />
      <Button text="Signup" onPress={handleSignUp} />
    </View>
  );
};

export default Index;
