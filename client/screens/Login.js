import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext, useState } from "react";
import { Button, Image, StatusBar, StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { checkLogin, log } from "../api/userAPI";
import { BuildMonitor } from "../App";
import MyButton from "../compontents/MyButton";
import MyError from "../compontents/MyError";


const Login = ({ navigation }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false)
  const [nextStep, setNextStep] = useState(false)
  const [triggerError, setTriggerError] = useState(false)

  const { setIsAuth, setUser } = useContext(BuildMonitor)

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
    log(name, password).then(res => {
      AsyncStorage.setItem('token', JSON.stringify(res))
      setIsAuth(true)
      setUser(res)
      return res
    }).catch(e => {
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
            <TextInput cursorColor={'black'} autoComplete="email" returnKeyType="next" blurOnSubmit={false} onSubmitEditing={checkName} editable={!nextStep} style={{...styles.TextInput, paddingLeft: 30, backgroundColor: nextStep ? 'white' : '#d4edff'}} onChangeText={setName} value={name} placeholder='Имя пользователя (e-mail)' />
          </View>
        </View>
        {nextStep && <TextInput cursorColor={'black'} autoFocus={true} blurOnSubmit={false} onSubmitEditing={LogIn} secureTextEntry={true} style={{...styles.TextInput, marginBottom: 15}} onChangeText={setPassword} value={password} placeholder='Пароль' />}
        <Button title='Продолжить' onPress={!nextStep ? checkName : LogIn} disabled={loading}  />
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
    backgroundColor: '#d4edff',
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'blue',
    borderTopRightRadius:5,
    borderTopLeftRadius:5,
  }
});

export default Login;
