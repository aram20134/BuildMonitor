import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from "@react-navigation/drawer";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, RecaptchaVerifier, GoogleAuthProvider, signInWithPopup, signInWithPhoneNumber } from "firebase/auth";
import { TextInput } from "react-native-gesture-handler";
import { useEffect, useRef, useState } from "react";

const firebaseConfig = {
    apiKey: "AIzaSyA9D6OoFE5GFCrTv9P2c0SAu5fJnxwO0XE",
    authDomain: "project-kakasha.firebaseapp.com",
    projectId: "project-kakasha",
    storageBucket: "project-kakasha.appspot.com",
    messagingSenderId: "597698872183",
    appId: "1:597698872183:web:c0b224df7c253547255772",
    measurementId: "G-QGWF4QEG37"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  
  const Tab = createMaterialTopTabNavigator()

const Tasks = () => {
    const [email, setEmail] = useState('')
    const [msg, setMsg] = useState()
    const [password, setPassword] = useState('')

    const b = useRef()

    const reg = () => {
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password).then(() => setMsg('Успешно зареган')).catch(() => setMsg('Произошли пробелмс'))
    }

    const getGoogle = () => {
        const auth = getAuth();

    }
    useEffect(() => {
        // const auth = getAuth();
        // window.recaptchaVerifier = new RecaptchaVerifier(b, {
        // 'size': 'invisible',
        // 'callback': (response) => {
        //     // reCAPTCHA solved, allow signInWithPhoneNumber.
        //     onSignInSubmit();
        // }
        // }, auth);
        
    }, [])
    

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <Text>Регис</Text>
            <TextInput value={email} onChangeText={setEmail} placeholder="маил" />
            <TextInput value={password} onChangeText={setPassword} placeholder="пароль" />
            <Button ref={b} title="регнутся" onPress={reg} />
            <Text>{msg}</Text>
        </View>
    )
}

const Plans = () => {
    const [email, setEmail] = useState('')
    const [msg, setMsg] = useState()
    const [password, setPassword] = useState('')

    const log = () => {
        const auth = getAuth();
        signInWithEmailAndPassword(auth, email, password).then((res) =>setMsg('Здарова, вот твой токен: ' + res._tokenResponse.idToken)).catch(() => setMsg('Произошли пробелмс'))
    }

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            <Text>Входик</Text>
            <TextInput value={email} onChangeText={setEmail} placeholder="маил" />
            <TextInput value={password} onChangeText={setPassword} placeholder="пароль" />
            <Button title="Вайти" onPress={log} />
            <Text>{msg}</Text>
        </View>
    )
}

const Home = () => {
    return (
      <Tab.Navigator screenOptions={{tabBarStyle: {backgroundColor:'#42b3ff'}, tabBarLabelStyle:{fontWeight:'bold', fontSize:14}, tabBarIndicatorStyle:{backgroundColor:'white'}}} >
        <Tab.Screen name="Задачи"  component={Tasks} />
        <Tab.Screen name="План" component={Plans}  />
      </Tab.Navigator>
    )
}

export default Home

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      backgroundColor: "white",
    },
});
  