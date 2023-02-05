import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Button, Image, ImageBackground, Pressable, StatusBar, StyleSheet, Text, TouchableHighlight, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import { checkLogin, log } from "../api/userAPI";
import MyButton from "../compontents/MyButton";
import MyError from "../compontents/MyError";


const Login = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false)
  const [nextStep, setNextStep] = useState(false)
  const [triggerError, setTriggerError] = useState(false)

  const inputPassword = useRef()

  const checkName = () => {
    setLoading(true)
    checkLogin(name).then((res) => {
      setNextStep(res.user)
    }).catch((e) => {
      setTriggerError(true)
      setTriggerError(false)
    }).finally(() => setLoading(false))
  }

  const LogIn = (e) => {
    setLoading(true)
    log(name, password).then(res => console.log(res)).catch(e => {
      setTriggerError(true)
      setTriggerError(false)
    }).finally(() => setLoading(false))
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={{ flex: 1 }}>
        <Image
          source={require("../assets/logo.png")}
          style={{ resizeMode: "contain", width: 250 }}
        />
      </View>
      <View style={{ flex: 1, display:'flex' }}>
        <Text style={styles.title}>Войдите в систему</Text> 
        <View style={{position:'relative', display:'flex'}}>
          <View style={{display:'flex', justifyContent:'center', marginBottom: 15}}>
            <Image resizeMode='contain' resizeMethod='resize' source={require('../assets/user.png')} style={{position:'absolute', zIndex:10, width:20, left:5}} />
            <TextInput autoComplete="email" returnKeyType="next" blurOnSubmit={false} onSubmitEditing={checkName} editable={!nextStep} style={{...styles.TextInput, paddingLeft: 30}} onChangeText={setName} value={name} placeholder='Имя пользователя (e-mail)' />
          </View>
        </View>
        {nextStep && <TextInput autoFocus={true} blurOnSubmit={false} onSubmitEditing={LogIn} secureTextEntry={true} style={{...styles.TextInput, marginBottom: 15}} onChangeText={setPassword} value={password} placeholder='Пароль' />}
        <MyButton title='Продолжить' onPress={!nextStep ? checkName : LogIn} disabled={loading}  />
      </View>
      <MyError errorMsg={'Неверное имя пользователья (e-mail) или пароль.'} trigger={triggerError} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "white",
  },
  title: {
    fontSize: 20,
    color: "#139",
    fontWeight: "bold",
    marginBottom: 10,
    textTransform: "uppercase",
  },
  TextInput: {
    backgroundColor: '#abdcff',
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'blue',
    borderTopRightRadius:5,
    borderTopLeftRadius:5,
  }
});

export default Login;
