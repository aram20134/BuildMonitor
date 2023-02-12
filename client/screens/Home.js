import { StatusBar } from "expo-status-bar";
import { Button, Image, StyleSheet, Text, View } from "react-native";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { useContext, useEffect } from "react";
import { BuildMonitor } from "../App";
import { BaseButton, BorderlessButton, GestureHandlerRootView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
  
const Tab = createMaterialTopTabNavigator()


const Tasks = () => {
    const { chosedLayer } = useContext(BuildMonitor)
    const navigation = useNavigation()
    
    const AddTskBtn = () => {
      return (
        <GestureHandlerRootView style={{display:'flex', position:'absolute', right:0, bottom:0, margin:20}}>
          <BorderlessButton rippleRadius={30} onPress={() => navigation.navigate('Создать задачу')}>
              <View accessible accessibilityRole="button" style={{}}>
                  <View style={{padding:10, color:'white', backgroundColor:'green', borderRadius:150, fontWeight:'bold'}}>
                    <Image source={require('../assets/plus.png')} style={{width:25, height:25}} />
                  </View>
              </View>
          </BorderlessButton>
        </GestureHandlerRootView>
      )
    }
    return !chosedLayer ? (
        <View style={styles.container2}>
            <StatusBar style="auto" />
            <Text style={{fontSize:24, color:'#4293ff'}}>Слой не выбран</Text>
        </View>
    ) : (
      !chosedLayer.tasks.length ? (
        <View style={styles.container}>
          <StatusBar style="auto" />
          <Text>Нет доступных задач</Text>
          <AddTskBtn />
        </View>
      ) : (
        <View style={styles.container}>
          <StatusBar style="auto" />
          <Text>Задачи....</Text>
          <AddTskBtn />
        </View>
      )
    )
}

const Plans = () => {
    const { chosedLayer } = useContext(BuildMonitor)
    return !chosedLayer ? (
        <View style={styles.container2}>
            <StatusBar style="auto" />
            <Text style={{fontSize:24, color:'#4293ff'}}>Слой не выбран</Text>
        </View>
    ) : (
      <View style={styles.container}>
          <StatusBar style="auto" />
          <Text>Plans</Text>
      </View>
    )
}

const Home = ({ navigation }) => {
    const { chosedProject, chosedLayer } = useContext(BuildMonitor)

    const CustomTitle = () => {
      return (
        <View>
          <Text style={{fontSize:20, fontWeight:'500', color:'white'}}>{chosedProject ? chosedProject?.name : 'BuildMonitor'}</Text>
          {chosedLayer && <Text style={{color:'#CBCBCB'}}>{chosedLayer.name}</Text> }
        </View>
      )
    }

    useEffect(() => {
      navigation.setOptions({title: <CustomTitle />})
    }, [chosedProject, chosedLayer])
    
    return (
      <Tab.Navigator screenOptions={{tabBarPressColor:'#CBCBCB', tabBarStyle: {backgroundColor:'#005D99'}, tabBarLabelStyle:{fontWeight:'bold', fontSize:14}, tabBarIndicatorStyle:{backgroundColor:'white'}, tabBarActiveTintColor:'white'}} >
        <Tab.Screen name="Задачи" component={Tasks} />
        <Tab.Screen name="План" component={Plans}  />
      </Tab.Navigator>
    )
}

export default Home

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
    },
    container2: {
      flex: 1,
      alignItems: "center",
      justifyContent:'center',
    },
});