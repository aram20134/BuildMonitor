import { StatusBar } from "expo-status-bar";
import { Button, Image, RefreshControl, StyleSheet, Text, View } from "react-native";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { useCallback, useContext, useEffect, useState } from "react";
import { BuildMonitor } from "../App";
import { BaseButton, BorderlessButton, GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { getTasks } from "../api/projectAPI";
  
const Tab = createMaterialTopTabNavigator()

const Tasks = () => {
    const { chosedLayer, setChosedLayer } = useContext(BuildMonitor)
    const navigation = useNavigation()
    const [refreshing, setRefreshing] = useState(false)
    
    const onRefresh = () => {
      getTasks(chosedLayer.id).then((res) => setChosedLayer({...chosedLayer, tasks: res})).finally(() => setRefreshing(false))
    }
      
    useEffect(() => {
      console.log(chosedLayer)
    }, [])
  
    useFocusEffect(useCallback(() => {
      if (chosedLayer) {
        console.log('foc')
        getTasks(chosedLayer.id).then((res) => setChosedLayer({...chosedLayer, tasks: res})).finally(() => setRefreshing(false))
      }
    }, []))
  
  
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
    const Task = ({task}) => {
      return (
        <GestureHandlerRootView style={{width:'95%', marginTop:10}}>
          <BaseButton style={{backgroundColor:'white', borderRadius:5, ...styles.shadows}} onPress={() => navigation.navigate('Задача', {task})}>
            <View accessible accessibilityRole="button" style={styles.taskContainer}>
              <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                <Text style={{color:'gray', fontSize:10}}>Создано пользователем {task.author}</Text>
                <Text style={{color:'gray', fontSize:10}}>{format(new Date(task.createdAt), 'dd.MM.yyyy', {locale: ru})}</Text>
              </View>
              <View style={{marginTop:5}}>
                <Text>{task.name}</Text>
              </View>
              <Text style={{color:'#005D99', borderWidth:1, borderColor:'#005D99', width: 40, textAlign:'center', borderRadius:15, paddingLeft:10, paddingRight:10, marginTop:5, }}>{task.id}</Text>
            </View>
          </BaseButton>
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
          <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} style={{width:'100%', height:'100%', flex:1}}>
              <View style={{width:'100%', alignItems:'center', paddingBottom:70}}>
                <Text style={{marginTop:15}}>Нет доступных задач</Text>
              </View>
            </ScrollView>
          <AddTskBtn />
        </View>
      ) : (
        <View style={styles.container}>
            <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} style={{width:'100%', height:'100%', flex:1}}>
              <View style={{width:'100%', alignItems:'center', paddingBottom:70}}>
                {chosedLayer.tasks.map((task) => <Task key={task.id} task={task} />)}
              </View>
            </ScrollView>
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
      height:'100%'
    },
    container2: {
      flex: 1,
      alignItems: "center",
      justifyContent:'center',
    },
    taskContainer: {
      flexDirection:'column',
      // width:'95%', 
      // backgroundColor:'white', 
      // borderRadius:5,
      padding:5
    },
    shadows: {
      shadowColor: "#000",
      shadowOffset: {
          width: 0,
          height: 2,
      },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 14,
    }
});