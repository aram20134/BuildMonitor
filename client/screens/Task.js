import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { useContext, useEffect, useState } from "react"
import { ActivityIndicator, Button, Image, StyleSheet, Text, View } from "react-native"
import { ScrollView } from "react-native-gesture-handler";
import { addTask, getForm } from "../api/projectAPI";
import { REACT_NATIVE_API_URL } from "../api/variables";
import { BuildMonitor } from "../App";
import MyInput from "../compontents/MyInput";

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
          <Button title="Удалить" color={'darkred'} onPress={() => console.log('first')} />
        )
      })
    }, [navigation])

    useEffect(() => {
      setLoading(true)
      
      getForm(task.formId).then((form) => {setForm(form), setAllValues(task.taskInfos)}).finally(() => setLoading(false))
    }, [])

    useEffect(() => {
      let timer = setTimeout(() => {
        const createTask = new FormData()
        const author = user.name
        const taskId = task.id
        createTask.append('allValues', JSON.stringify(allValues))
        createTask.append('formId', task.formId)
        createTask.append('layerId', task.layerId)
        createTask.append('author', author)
        createTask.append('taskId', taskId)
        addTask(createTask).then((res) => console.log(res))
      }, 300);
      return () => {
        clearTimeout(timer)
      }
      
    }, [allValues])
    
    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={{...styles.shadows, backgroundColor:'white', width:'95%', marginTop:10, alignItems:'center', padding:15, borderWidth:2, borderColor:'#005D99', borderRadius:5}}>
            <Text style={{fontSize:16}}>{task.name}</Text>
            <Text style={{marginTop:5, fontSize:12, color:'gray'}}>{'в ' + format(new Date(task.createdAt), 'dd.MM.yyyy', {locale: ru})}</Text>
            <Text style={{color:'#005D99', borderWidth:1, borderColor:'#005D99', width: 40, textAlign:'center', borderRadius:15, paddingLeft:10, paddingRight:10, marginTop:10}}>{task.id}</Text>
          </View>
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
              return <MyInput key={form.name} placeholder={'Добавить текст'} type={form.type} title={form.name} defaultValue={pair.value} onCheckboxChange={(chk) => setAllValues(prev => prev.map((val) => val.name === form.name ? {...val, value: chk} : val))} onChangeText={(text) => setAllValues(prev => prev.map((val) => val.name === form.name ? {...val, value: text} : val))} />
            } else {
              return <MyInput key={form.name} placeholder={'Добавить текст'} type={form.type} title={form.name} />
            }
          }) : (
            <ActivityIndicator size={'large'} />
          )}    
          <View>
      
          </View>
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