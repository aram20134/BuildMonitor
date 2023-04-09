import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { useContext, useEffect, useState } from "react"
import { ActivityIndicator, Button, Image, StyleSheet, Text, View } from "react-native"
import { ScrollView } from "react-native-gesture-handler";
import { addTask, delTask, getForm } from "../api/projectAPI";
import { REACT_NATIVE_API_URL } from "../api/variables";
import { BuildMonitor } from "../App";
import MyInput from "../compontents/MyInput";
import { Slider } from '@miblanchard/react-native-slider';

const Task = ({ route, navigation }) => {
    const [loading, setLoading] = useState(true)
    const [task, setTask] = useState(route.params.task)
    const [form, setForm] = useState()
    const [allValues, setAllValues] = useState([{}])

    const {user} = useContext(BuildMonitor)

    useEffect(() => {
      navigation.setOptions({
        title: `${task.id} - ${task.name}`,
        headerRight: () => (
          <Button title="Удалить" color={'darkred'} onPress={() => delTask(task.id).then(() => navigation.goBack())} />
        )
      })
    }, [navigation])

    useEffect(() => {
      setLoading(true)
      
      getForm(task.formId).then((form) => {setForm(form), setAllValues(task.taskInfos)}).finally(() => setLoading(false))
    }, [])

    const chooseDate = (pair) => {
      DateTimePickerAndroid.open({
          onChange: (event, selectedDate) => setAllValues(prev => prev.map((val) => val.name === pair.name ? {...val, value: selectedDate} : val)),
          mode: 'date',
          value: new Date(),
      })
    }

    const chooseTime = (pair) => {
      DateTimePickerAndroid.open({
          onChange: (event, selectedDate) => setAllValues(prev => prev.map((val) => val.name === pair.name ? {...val, value: selectedDate} : val)),
          mode: 'time',
          value: new Date(),
          is24Hour: true
      })
    }

    useEffect(() => {
      let timer = setTimeout(() => {
        const createTask = new FormData()
        const author = user.name
        const taskId = task.id
        console.log(allValues)
        createTask.append('allValues', JSON.stringify(allValues))
        createTask.append('formId', task.formId)
        createTask.append('layerId', task.layerId)
        createTask.append('author', author)
        createTask.append('taskId', taskId)
        addTask(createTask)
        // setAllValues(res.taskInfos))
      }, 300);
      return () => {
        clearTimeout(timer)
      }
    }, [allValues])

    const InfoBlock = () => {
      const isState = allValues.filter((info) => info.name === 'Статус')[0]?.value
      switch (isState) {
        case 'Открыто':
          return (
            <View style={{...styles.shadows, backgroundColor:'#de4317', width:'95%', marginTop:10, alignItems:'center', padding:15, borderWidth:2, borderColor:'#de4317', borderRadius:5}}>
              <Text style={{fontSize:16, color:'white', fontWeight:'500'}}>{task.name}</Text>
              <Text style={{marginTop:5, fontSize:12, color:'white'}}>{'в ' + format(new Date(task.createdAt), 'dd.MM.yyyy', {locale: ru})}</Text>
              <View style={{display:'flex', flexDirection:'row', alignItems:'center', marginTop:5}}>
                <Text style={{fontWeight:'bold', marginRight:7, color:'#de4317', borderWidth:1, backgroundColor:'white', borderColor:'#de4317', width: 40, textAlign:'center', borderRadius:15, paddingLeft:10, paddingRight:10}}>{task.id}</Text>
                <Text style={{fontWeight:'600', textAlign:'center', borderRadius:15, paddingLeft:10, paddingRight:10, backgroundColor:'#ed8163', color:'white'}}>{isState}</Text>
              </View>
            </View>
          )
        case 'В работе':
          return (
            <View style={{...styles.shadows, backgroundColor:'#2f53c0', width:'95%', marginTop:10, alignItems:'center', padding:15, borderWidth:2, borderColor:'#2f53c0', borderRadius:5}}>
              <Text style={{fontSize:16, color:'white', fontWeight:'500'}}>{task.name}</Text>
              <Text style={{marginTop:5, fontSize:12, color:'white'}}>{'в ' + format(new Date(task.createdAt), 'dd.MM.yyyy', {locale: ru})}</Text>
              <View style={{display:'flex', flexDirection:'row', alignItems:'center', marginTop:5}}>
                <Text style={{fontWeight:'bold', marginRight:7, color:'#2f53c0', borderWidth:1, backgroundColor:'white', borderColor:'#2f53c0', width: 40, textAlign:'center', borderRadius:15, paddingLeft:10, paddingRight:10}}>{task.id}</Text>
                <Text style={{fontWeight:'600', textAlign:'center', borderRadius:15, paddingLeft:10, paddingRight:10, backgroundColor:'#7f96db', color:'white'}}>{isState}</Text>
              </View>
            </View>
          )
        case 'Решено':
          return (
            <View style={{...styles.shadows, backgroundColor:'green', width:'95%', marginTop:10, alignItems:'center', padding:15, borderWidth:2, borderColor:'green', borderRadius:5}}>
              <Text style={{fontSize:16, color:'white', fontWeight:'500'}}>{task.name}</Text>
              <Text style={{marginTop:5, fontSize:12, color:'white'}}>{'в ' + format(new Date(task.createdAt), 'dd.MM.yyyy', {locale: ru})}</Text>
              <View style={{display:'flex', flexDirection:'row', alignItems:'center', marginTop:5}}>
                <Text style={{fontWeight:'bold', marginRight:7, color:'green', borderWidth:1, backgroundColor:'white', borderColor:'green', width: 40, textAlign:'center', borderRadius:15, paddingLeft:10, paddingRight:10}}>{task.id}</Text>
                <Text style={{fontWeight:'600', textAlign:'center', borderRadius:15, paddingLeft:10, paddingRight:10, backgroundColor:'#63ad01', color:'white'}}>{isState}</Text>
              </View>
            </View>
          )
        case 'Ожидание обратной связи':
          return (
            <View style={{...styles.shadows, backgroundColor:'#f0a801', width:'95%', marginTop:10, alignItems:'center', padding:15, borderWidth:2, borderColor:'#f0a801', borderRadius:5}}>
              <Text style={{fontSize:16, color:'white', fontWeight:'500'}}>{task.name}</Text>
              <Text style={{marginTop:5, fontSize:12, color:'white'}}>{'в ' + format(new Date(task.createdAt), 'dd.MM.yyyy', {locale: ru})}</Text>
              <View style={{display:'flex', flexDirection:'row', alignItems:'center', marginTop:5}}>
                <Text style={{fontWeight:'bold', marginRight:7, color:'#f0a801', borderWidth:1, backgroundColor:'white', borderColor:'#f0a801', width: 40, textAlign:'center', borderRadius:15, paddingLeft:10, paddingRight:10}}>{task.id}</Text>
                <Text style={{fontWeight:'600', textAlign:'center', borderRadius:15, paddingLeft:10, paddingRight:10, backgroundColor:'#ffcb5b', color:'white'}}>{isState}</Text>
              </View>
            </View>
          )
        case 'Отклонено':
          return (
            <View style={{...styles.shadows, backgroundColor:'#474747', width:'95%', marginTop:10, alignItems:'center', padding:15, borderWidth:2, borderColor:'#474747', borderRadius:5}}>
              <Text style={{fontSize:16, color:'white', fontWeight:'500'}}>{task.name}</Text>
              <Text style={{marginTop:5, fontSize:12, color:'white'}}>{'в ' + format(new Date(task.createdAt), 'dd.MM.yyyy', {locale: ru})}</Text>
              <View style={{display:'flex', flexDirection:'row', alignItems:'center', marginTop:5}}>
                <Text style={{fontWeight:'bold', marginRight:7, color:'#474747', borderWidth:1, backgroundColor:'white', borderColor:'#474747', width: 40, textAlign:'center', borderRadius:15, paddingLeft:10, paddingRight:10}}>{task.id}</Text>
                <Text style={{fontWeight:'600', textAlign:'center', borderRadius:15, paddingLeft:10, paddingRight:10, backgroundColor:'#646458', color:'white'}}>{isState}</Text>
              </View>
            </View>
          )
        case 'Закрыто':
          return (
            <View style={{...styles.shadows, backgroundColor:'#b2b2b2', width:'95%', marginTop:10, alignItems:'center', padding:15, borderWidth:2, borderColor:'#b2b2b2', borderRadius:5}}>
              <Text style={{fontSize:16, color:'white', fontWeight:'500'}}>{task.name}</Text>
              <Text style={{marginTop:5, fontSize:12, color:'white'}}>{'в ' + format(new Date(task.createdAt), 'dd.MM.yyyy', {locale: ru})}</Text>
              <View style={{display:'flex', flexDirection:'row', alignItems:'center', marginTop:5}}>
                <Text style={{fontWeight:'bold', marginRight:7, color:'#b2b2b2', borderWidth:1, backgroundColor:'white', borderColor:'#b2b2b2', width: 40, textAlign:'center', borderRadius:15, paddingLeft:10, paddingRight:10}}>{task.id}</Text>
                <Text style={{fontWeight:'600', textAlign:'center', borderRadius:15, paddingLeft:10, paddingRight:10, backgroundColor:'#c4c4c4', color:'white'}}>{isState}</Text>
              </View>
            </View>
          )
        default:
          return (
            <View style={{...styles.shadows, backgroundColor:'white', width:'95%', marginTop:10, alignItems:'center', padding:15, borderWidth:2, borderColor:'#005D99', borderRadius:5}}>
              <Text style={{fontSize:16}}>{task.name}</Text>
              <Text style={{marginTop:5, fontSize:12, color:'gray'}}>{'в ' + format(new Date(task.createdAt), 'dd.MM.yyyy', {locale: ru})}</Text>
              <Text style={{color:'#005D99', borderWidth:1, borderColor:'#005D99', width: 40, textAlign:'center', borderRadius:15, paddingLeft:10, paddingRight:10, marginTop:10}}>{task.id}</Text>
            </View>
          )
      }
    }

    return (
      <ScrollView>
        <View style={styles.container}>
          <InfoBlock />
          <View style={{marginTop:15, marginBottom:10}}>
            <Text style={{textTransform:'uppercase', fontSize:12}}>{loading ? 'Форма: Загрузка...' : 'Форма: ' + form.name}</Text>
          </View>
          <View style={{width:'100%', alignItems:'center', padding:10}}>
            {/* <MyInput title={'Фотография'} type='image' required /> */}
            {task.image && <Image source={{uri: `${REACT_NATIVE_API_URL}static/taskImages/${task.image}`}} style={{width:'100%', height:250}} resizeMode='contain' />}
          </View>
          <MyInput title={'Название'} defaultValue={task.name} type='text' required onChangeText={(text) => setAllValues(prev => prev.map((val) => val.name === 'Название' ? {...val, value: text} : val))} />
          {!loading ? form.formInfos.map((form) => {
            var pair = allValues.filter((taskInfo) => taskInfo.name === form.name)[0]

            if (pair) {
              switch (form.type) {
                case 'time':
                  return <MyInput key={form.id} chooseTime={() => chooseTime(pair)} value={form.listInfos} placeholder={'Добавить текст'} type={form.type} title={form.name} timeValue={pair.value !== null ? format(new Date(pair.value), 'HH:mm', {locale: ru}) : 'Выбрать'} defaultValue={pair.value} onChangeText={(text) => setAllValues(prev => prev.map((val) => val.name === form.name ? {...val, value: text} : val))} />
                case 'date':
                  return <MyInput key={form.id} chooseDate={() => chooseDate(pair)} value={form.listInfos} placeholder={'Добавить текст'} type={form.type} title={form.name} dateValue={pair.value !== null ? format(new Date(pair.value), 'dd.MM.yyyy', {locale: ru}) : 'Выбрать'} defaultValue={pair.value}  onChangeText={(text) => setAllValues(prev => prev.map((val) => val.name === form.name ? {...val, value: text} : val))} />
                case 'slider':
                  return <MyInput key={form.id} value={form.listInfos} placeholder={'Добавить текст'} type={form.type} title={form.name} defaultValue={pair.value} onChangeText={(text) => setAllValues(prev => prev.map((val) => val.name === form.name ? {...val, value: text} : val))} />
                case 'list':
                  return <MyInput key={form.id} value={form.listInfos} placeholder={'Выбрать'} type={form.type} title={form.name} defaultValue={pair.value} onChangeText={(text) => setAllValues(prev => prev.map((val) => val.name === form.name ? {...val, value: text} : val))} />
                default:
                  return <MyInput key={form.id} value={form.listInfos} placeholder={'Добавить текст'} type={form.type} title={form.name} defaultValue={pair.value} onCheckboxChange={(chk) => setAllValues(prev => prev.map((val) => val.name === form.name ? {...val, value: chk} : val))} onChangeText={(text) => setAllValues(prev => prev.map((val) => val.name === form.name ? {...val, value: text} : val))} />
              }
            } else {
              return <MyInput key={form.id} placeholder={'Добавить текст'} type={form.type} title={form.name} />
            }
          }) : (
            <ActivityIndicator size={'large'} />
          )}
        </View>
      </ScrollView>
    )
}

export default Task

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
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
})