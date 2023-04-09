import { StatusBar } from "expo-status-bar";
import { Button, Dimensions, Image, ImageBackground, RefreshControl, StyleSheet, Text, UIManager, View, findNodeHandle, ScrollView } from "react-native";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { BuildMonitor } from "../App";
import { BaseButton, BorderlessButton, GestureHandlerRootView } from "react-native-gesture-handler";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { getTasks } from "../api/projectAPI";
import ImageZoom from "react-native-image-pan-zoom";
import Draggable from "react-native-draggable";
import { REACT_NATIVE_API_URL } from "../api/variables";
  
const Tab = createMaterialTopTabNavigator()

const AddTskBtn = ({type, onPress}) => {
  const navigation = useNavigation()

  return type === 'task' ? (
    <GestureHandlerRootView style={{display:'flex', position:'absolute', right:0, bottom:0, margin:20, zIndex:1000}}>
      <BorderlessButton style={{zIndex:1000}} rippleRadius={30} onPress={() => navigation.navigate('Создать задачу')}>
          <View accessible accessibilityRole="button" style={{}}>
              <View style={{padding:10, color:'white', backgroundColor:'green', borderRadius:150, fontWeight:'bold'}}>
                <Image source={require('../assets/plus.png')} style={{width:25, height:25}} />
              </View>
          </View>
      </BorderlessButton>
    </GestureHandlerRootView>
  ) : (
    <GestureHandlerRootView style={{display:'flex', position:'absolute', right:0, bottom:0, margin:20, zIndex:1000}}>
      <BorderlessButton rippleRadius={30} onPress={onPress}>
          <View accessible accessibilityRole="button" style={{}}>
              <View style={{padding:10, color:'white', backgroundColor:'green', borderRadius:150, fontWeight:'bold'}}>
                <Image source={require('../assets/markerWhite.png')} style={{width:25, height:25}} />
              </View>
          </View>
      </BorderlessButton>
    </GestureHandlerRootView>
  )
}

const Tasks = () => {
    const { chosedLayer, setChosedLayer } = useContext(BuildMonitor)
    const [refreshing, setRefreshing] = useState(false)
    const navigation = useNavigation()
    
    const onRefresh = () => {
      getTasks(chosedLayer.id).then((res) => setChosedLayer({...chosedLayer, tasks: res})).finally(() => setRefreshing(false))
    }
  
    useFocusEffect(useCallback(() => {
      if (chosedLayer) {
        getTasks(chosedLayer.id).then((res) => setChosedLayer({...chosedLayer, tasks: res}))
      }
    }, []))

    const Task = ({task}) => {
      const isState = task.taskInfos.filter((info) => info.name === 'Статус')[0]?.value
      const makeBefore = task.taskInfos.filter((info) => info.name === 'Выполнить до')[0]?.value
      const attach = task.image ? true : false
      const priority = task.taskInfos.filter((info) => info.name === 'Приоритет')[0]?.value
      const PerfImage = () => {
        switch (priority) {
          case 'Высокий':
            return (
              <Image source={require('../assets/perfHigh.png')} style={{height:20, width:20}} />
            )
          case 'Средний':
            return (
              <Image source={require('../assets/perfMedium.png')} style={{height:20, width:20}} />
            )
          case 'Низкий':
            return (
              <Image source={require('../assets/perfLow.png')} style={{height:20, width:20}} />
            )
        }
      }

      switch (isState) {
        case 'Открыто':
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
                  <View style={{display:'flex', flexDirection:'row', alignItems:'center', marginTop:5}}>
                    <Text style={{fontSize:12, marginRight:7, color:'white', borderWidth:1, backgroundColor:'#de4317', borderColor:'#de4317', width: 40, textAlign:'center', borderRadius:15, paddingLeft:10, paddingRight:10}}>{task.id}</Text>
                    <Text style={{fontSize:12, marginRight:7, borderWidth:1, textAlign:'center', borderRadius:15, paddingLeft:10, paddingRight:10, borderColor:'#b2b2b2', backgroundColor:'#eeee'}}>{isState}</Text>
                    {attach && <View style={{marginRight:5, borderColor:'#b2b2b2', backgroundColor:'#eeee', borderWidth:1, borderRadius:100, padding:3}}><Image source={require('../assets/attach.png')} style={{width:10, height:10}} resizeMode='contain' /></View>}
                    {makeBefore && <Text style={{ fontSize:12, borderWidth:1, textAlign:'center', borderRadius:15, paddingLeft:10, paddingRight:10, borderColor:'#b2b2b2'}}>{format(new Date(makeBefore), 'dd.MM.yyyy', {locale: ru})}</Text>}
                    {priority && <PerfImage />}
                  </View>
                  {task.image && <Image source={{uri: `${REACT_NATIVE_API_URL}static/taskImages/${task.image}`, height:200, width:'100%'}} resizeMode='cover' style={{marginTop:10, borderRadius:5}} />}
                </View>
              </BaseButton>
            </GestureHandlerRootView>
          )
        case 'В работе':
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
                  <View style={{display:'flex', flexDirection:'row', alignItems:'center', marginTop:5}}>
                    <Text style={{fontSize:12, marginRight:7, color:'white', borderWidth:1, backgroundColor:'#2f53c0', borderColor:'#2f53c0', width: 40, textAlign:'center', borderRadius:15, paddingLeft:10, paddingRight:10}}>{task.id}</Text>
                    <Text style={{fontSize:12, marginRight:7, borderWidth:1, textAlign:'center', borderRadius:15, paddingLeft:10, paddingRight:10, borderColor:'#b2b2b2', backgroundColor:'#eeee'}}>{isState}</Text>
                    {attach && <View style={{marginRight:5, borderColor:'#b2b2b2', backgroundColor:'#eeee', borderWidth:1, borderRadius:100, padding:3}}><Image source={require('../assets/attach.png')} style={{width:10, height:10}} resizeMode='contain' /></View>}
                    {makeBefore && <Text style={{ fontSize:12, borderWidth:1, textAlign:'center', borderRadius:15, paddingLeft:10, paddingRight:10, borderColor:'#b2b2b2'}}>{format(new Date(makeBefore), 'dd.MM.yyyy', {locale: ru})}</Text>}
                    {priority && <PerfImage />}
                  </View>
                  {task.image && <Image source={{uri: `${REACT_NATIVE_API_URL}static/taskImages/${task.image}`, height:200, width:'100%'}} resizeMode='cover' style={{marginTop:10, borderRadius:5}} />}
                </View>
              </BaseButton>
            </GestureHandlerRootView>
          )
        case 'Решено':
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
                  <View style={{display:'flex', flexDirection:'row', alignItems:'center', marginTop:5}}>
                    <Text style={{fontSize:12, marginRight:7, color:'white', borderWidth:1, backgroundColor:'#63ad01', borderColor:'#63ad01', width: 40, textAlign:'center', borderRadius:15, paddingLeft:10, paddingRight:10}}>{task.id}</Text>
                    <Text style={{fontSize:12, marginRight:7, borderWidth:1, textAlign:'center', borderRadius:15, paddingLeft:10, paddingRight:10, borderColor:'#b2b2b2', backgroundColor:'#eeee'}}>{isState}</Text>
                    {attach && <View style={{marginRight:5, borderColor:'#b2b2b2', backgroundColor:'#eeee', borderWidth:1, borderRadius:100, padding:3}}><Image source={require('../assets/attach.png')} style={{width:10, height:10}} resizeMode='contain' /></View>}
                    {makeBefore && <Text style={{ fontSize:12, borderWidth:1, textAlign:'center', borderRadius:15, paddingLeft:10, paddingRight:10, borderColor:'#b2b2b2'}}>{format(new Date(makeBefore), 'dd.MM.yyyy', {locale: ru})}</Text>}
                    {priority && <PerfImage />}
                  </View>
                  {task.image && <Image source={{uri: `${REACT_NATIVE_API_URL}static/taskImages/${task.image}`, height:200, width:'100%'}} resizeMode='cover' style={{marginTop:10, borderRadius:5}} />}
                </View>
              </BaseButton>
            </GestureHandlerRootView>
          )
        case 'Ожидание обратной связи':
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
                  <View style={{display:'flex', flexDirection:'row', alignItems:'center', marginTop:5}}>
                    <Text style={{fontSize:12, marginRight:7, color:'white', borderWidth:1, backgroundColor:'#f0a801', borderColor:'#f0a801', width: 40, textAlign:'center', borderRadius:15, paddingLeft:10, paddingRight:10}}>{task.id}</Text>
                    <Text style={{fontSize:12, marginRight:7, borderWidth:1, textAlign:'center', borderRadius:15, paddingLeft:10, paddingRight:10, borderColor:'#b2b2b2', backgroundColor:'#eeee'}}>{isState}</Text>
                    {attach && <View style={{marginRight:5, borderColor:'#b2b2b2', backgroundColor:'#eeee', borderWidth:1, borderRadius:100, padding:3}}><Image source={require('../assets/attach.png')} style={{width:10, height:10}} resizeMode='contain' /></View>}
                    {makeBefore && <Text style={{ fontSize:12, borderWidth:1, textAlign:'center', borderRadius:15, paddingLeft:10, paddingRight:10, borderColor:'#b2b2b2'}}>{format(new Date(makeBefore), 'dd.MM.yyyy', {locale: ru})}</Text>}
                    {priority && <PerfImage />}
                  </View>
                  {task.image && <Image source={{uri: `${REACT_NATIVE_API_URL}static/taskImages/${task.image}`, height:200, width:'100%'}} resizeMode='cover' style={{marginTop:10, borderRadius:5}} />}
                </View>
              </BaseButton>
            </GestureHandlerRootView>
          )
        case 'Отклонено':
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
                  <View style={{display:'flex', flexDirection:'row', alignItems:'center', marginTop:5}}>
                    <Text style={{fontSize:12, marginRight:7, color:'white', borderWidth:1, backgroundColor:'#646458', borderColor:'#646458', width: 40, textAlign:'center', borderRadius:15, paddingLeft:10, paddingRight:10}}>{task.id}</Text>
                    <Text style={{fontSize:12, marginRight:7, borderWidth:1, textAlign:'center', borderRadius:15, paddingLeft:10, paddingRight:10, borderColor:'#b2b2b2', backgroundColor:'#eeee'}}>{isState}</Text>
                    {attach && <View style={{marginRight:5, borderColor:'#b2b2b2', backgroundColor:'#eeee', borderWidth:1, borderRadius:100, padding:3}}><Image source={require('../assets/attach.png')} style={{width:10, height:10}} resizeMode='contain' /></View>}
                    {makeBefore && <Text style={{ fontSize:12, borderWidth:1, textAlign:'center', borderRadius:15, paddingLeft:10, paddingRight:10, borderColor:'#b2b2b2'}}>{format(new Date(makeBefore), 'dd.MM.yyyy', {locale: ru})}</Text>}
                    {priority && <PerfImage />}
                  </View>
                  {task.image && <Image source={{uri: `${REACT_NATIVE_API_URL}static/taskImages/${task.image}`, height:200, width:'100%'}} resizeMode='cover' style={{marginTop:10, borderRadius:5}} />}
                </View>
              </BaseButton>
            </GestureHandlerRootView>
          )
        case 'Закрыто':
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
                  <View style={{display:'flex', flexDirection:'row', alignItems:'center', marginTop:5}}>
                    <Text style={{marginRight:7, color:'white', borderWidth:1, backgroundColor:'#b2b2b2', borderColor:'#b2b2b2', width: 40, textAlign:'center', borderRadius:15, paddingLeft:10, paddingRight:10}}>{task.id}</Text>
                    <Text style={{borderWidth:1, textAlign:'center', borderRadius:15, paddingLeft:10, paddingRight:10, borderColor:'#b2b2b2', backgroundColor:'#eeee'}}>{isState}</Text>
                    {attach && <View style={{marginRight:5, borderColor:'#b2b2b2', backgroundColor:'#eeee', borderWidth:1, borderRadius:100, padding:3}}><Image source={require('../assets/attach.png')} style={{width:10, height:10}} resizeMode='contain' /></View>}
                    {makeBefore && <Text style={{ fontSize:12, borderWidth:1, textAlign:'center', borderRadius:15, paddingLeft:10, paddingRight:10, borderColor:'#b2b2b2'}}>{format(new Date(makeBefore), 'dd.MM.yyyy', {locale: ru})}</Text>}
                    {priority && <PerfImage />}
                  </View>
                  {task.image && <Image source={{uri: `${REACT_NATIVE_API_URL}static/taskImages/${task.image}`, height:200, width:'100%'}} resizeMode='cover' style={{marginTop:10, borderRadius:5}} />}
                </View>
              </BaseButton>
            </GestureHandlerRootView>
          )
        default:
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
                  {task.image && <Image source={{uri: `${REACT_NATIVE_API_URL}static/taskImages/${task.image}`, height:200, width:'100%'}} resizeMode='cover' style={{marginTop:10, borderRadius:5}} />}
                </View>
              </BaseButton>
            </GestureHandlerRootView>
          )
      }
    }
    
    return !chosedLayer ? (
        <View style={styles.container2}>
            <StatusBar style="auto" />
            <Text style={{fontSize:24, color:'#4293ff'}}>Слой не выбран</Text>
        </View>
    ) : (
      !chosedLayer.tasks.length ? (
        <View style={styles.container2}>
          <ScrollView contentContainerStyle={{justifyContent:'center', flexGrow:1}} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
              <Text style={{fontSize:24, color:'#4293ff'}}>Нет доступных задач</Text>
          </ScrollView>
          <AddTskBtn type={'task'} />
        </View>
      ) : (
        <View style={styles.container}>
          <AddTskBtn type={'task'} />
            <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} style={{width:'100%', height:'100%', flex:1}}>
              <View style={{width:'100%', alignItems:'center', paddingBottom:70}}>
                {chosedLayer.tasks.sort((a, b) => b.id - a.id).map((task) => <Task key={task.id} task={task} />)}
              </View>
            </ScrollView>
        </View>
      )
    )
}

const Plans = () => {
    const { chosedLayer } = useContext(BuildMonitor)
    const navigation = useNavigation()
    const [x, setX] = useState(0)
    const [y, setY] = useState(0)
    const [imageSize, setImageSize] = useState({width: 0, height:0})
    const [pos, setPos] = useState(false)
    const img = useRef(null)

    const handle = (e, gesture, bounds) => {
      // console.log(e.nativeEvent)
      // setX(e?.nativeEvent?.pageX - e?.nativeEvent?.locationX)
      // setY(e?.nativeEvent?.pageY - e?.nativeEvent?.locationY)
      // setX(e?.nativeEvent?.locationX)
      // setY(e?.nativeEvent?.locationY)
      // console.log(x, y)
      // console.log(e?.nativeEvent)
      UIManager.measure(findNodeHandle(img.current), (x, y, w, h) => console.log(x, y, w, h))
      
  }

  useEffect(() => {
    // Image.getSize(`${REACT_NATIVE_API_URL}static/layerImages/${chosedLayer.plan}`, (w, h) => setImageSize({width:w, height:h}))
  }, [])
  

    if (!chosedLayer) {
      return (
        <View style={styles.container2}>
            <StatusBar style="auto" />
            <Text style={{fontSize:24, color:'#4293ff'}}>Слой не выбран</Text>
        </View>
      )
    }
    
    return chosedLayer.plan ? (
      <View style={styles.container}>
          <StatusBar style="auto" />
          <ImageBackground style={{justifyContent:'center', display:'flex', alignItems:'center', flex:1, width:'100%'}} imageStyle={{opacity:0.2}} resizeMode='repeat' resizeMethod='auto' source={require('../assets/backBlueprint.jpg')}>
            <ImageZoom maxScale={2} enableSwipeDown={false} minScale={1} cropWidth={Dimensions.get('screen').width} cropHeight={1200} imageWidth={410} imageHeight={250}>
              {/* <Image source={require('../assets/marker.png')} style={{color:'white', zIndex:200, width:20, height:20, position:'absolute', left:x, top:y}} /> */}
              <Image source={{uri: `${REACT_NATIVE_API_URL}static/layerImages/${chosedLayer.plan}`, height:'100%', width:'100%'}} resizeMode='cover'  />  
              {/* <Draggable maxY={350} minY={-150} maxX={650} minX={'100%'} onDragRelease={handle}>
                <View accessible={true} ref={img} style={{width:420, height:250, alignItems:'center', justifyContent:'center'}}>
                  <View style={{borderBottomWidth:1, borderBottomColor:'red', width:1000, transform:[{rotate:'90deg'}], borderStyle:'dashed'}}></View>
                  <Image style={{width:50, height:50, zIndex:200}} source={require('../assets/marker.png')} />
                  <View style={{borderBottomWidth:1, borderBottomColor:'red', width:1000, borderStyle:'dashed'}}></View>
                </View>
              </Draggable> */}
            </ImageZoom>
          </ImageBackground>
          {/* <AddTskBtn onPress={() => setPos(true)} /> */}
      </View>
    ) : (
      <View style={styles.container2}>
          <StatusBar style="auto" />
          <ImageBackground style={{justifyContent:'center', display:'flex', alignItems:'center', flex:1, width:'100%'}} imageStyle={{opacity:0.2}} resizeMode='repeat' resizeMethod='auto' source={require('../assets/backBlueprint.jpg')}>
            <Image source={require('../assets/blueprint.png')} style={{width:100, height:100, marginBottom:30}} />
            <Text style={{fontSize:24, color:'#4293ff', marginBottom:30}}>Для выбранного слоя нет плана</Text>
            {/* <Button onPress={() => navigation.navigate('Manage Layers')} title="Загрузить чертёж" /> */}
          </ImageBackground>
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